import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { MatchesGrid } from "@/components/matches-grid"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MatchesPage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  // Get all profiles (potential matches) - exclude current user
  const { data: allMatches } = await supabase
    .from("profiles")
    .select("*, users!inner(id)")
    .neq("user_id", session.user_id)
    .order("created_at", { ascending: false })

  // Get shortlisted profiles
  const { data: shortlistData } = await supabase
    .from("shortlist")
    .select("profile_id, profiles!inner(*, users!inner(id))")
    .eq("user_id", session.user_id)

  const shortlistedMatches = shortlistData?.map((item: any) => item.profiles) || []

  // Get premium matches (for demo, just get first 10)
  const premiumMatches = allMatches?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={currentProfile?.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
          <p className="text-muted-foreground">Find your perfect match from {allMatches?.length || 0} profiles</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MatchesGrid matches={allMatches || []} currentUserId={session.user_id} />
          </TabsContent>

          <TabsContent value="premium">
            <Card className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Premium Matches</h3>
                    <p className="text-sm text-muted-foreground">
                      Get access to verified profiles with premium membership
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <MatchesGrid matches={premiumMatches} currentUserId={session.user_id} />
          </TabsContent>

          <TabsContent value="shortlisted">
            {shortlistedMatches.length > 0 ? (
              <MatchesGrid matches={shortlistedMatches} currentUserId={session.user_id} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">You haven't shortlisted any profiles yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
