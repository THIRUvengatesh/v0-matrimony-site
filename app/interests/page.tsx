import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { InterestCard } from "@/components/interest-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InterestsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  // Get sent interests with receiver profiles
  const { data: sentInterests } = await supabase
    .from("interests")
    .select("*, receiver:profiles!interests_receiver_id_fkey(*)")
    .eq("sender_id", session.user_id)
    .order("created_at", { ascending: false })

  // Get received interests with sender profiles
  const { data: receivedInterests } = await supabase
    .from("interests")
    .select("*, sender:profiles!interests_sender_id_fkey(*)")
    .eq("receiver_id", session.user_id)
    .order("created_at", { ascending: false })

  // Get accepted interests (mutual matches)
  const { data: acceptedInterests } = await supabase
    .from("interests")
    .select("*, sender:profiles!interests_sender_id_fkey(*), receiver:profiles!interests_receiver_id_fkey(*)")
    .or(`sender_id.eq.${session.user_id},receiver_id.eq.${session.user_id}`)
    .eq("status", "accepted")
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={currentProfile?.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Interests</h1>
          <p className="text-muted-foreground">Manage your interests and connections</p>
        </div>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="received">
              Received ({receivedInterests?.filter((i: any) => i.status === "pending").length || 0})
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentInterests?.length || 0})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedInterests?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <div className="space-y-4">
              {receivedInterests && receivedInterests.length > 0 ? (
                receivedInterests.map((interest: any) => (
                  <InterestCard key={interest.id} interest={interest} type="received" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No interests received yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent">
            <div className="space-y-4">
              {sentInterests && sentInterests.length > 0 ? (
                sentInterests.map((interest: any) => <InterestCard key={interest.id} interest={interest} type="sent" />)
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">You haven't sent any interests yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accepted">
            <div className="space-y-4">
              {acceptedInterests && acceptedInterests.length > 0 ? (
                acceptedInterests.map((interest: any) => (
                  <InterestCard key={interest.id} interest={interest} type="accepted" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No accepted interests yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
