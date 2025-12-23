import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Briefcase, GraduationCap, Heart, Ruler, Church } from "lucide-react"

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!profile) {
    redirect("/dashboard")
  }

  const age = calculateAge(profile.date_of_birth)

  async function handleSendInterest() {
    "use server"
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/interests/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: profile.user_id }),
    })
    return response.json()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">MatrimonyMatch</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl bg-rose-100 text-rose-600">
                  {profile.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{profile.full_name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {profile.gender} • {age} years
                  </Badge>
                  {profile.height && (
                    <Badge variant="outline">
                      <Ruler className="h-3 w-3 mr-1" />
                      {profile.height} cm
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-medium">Occupation</p>
                    <p className="text-sm text-muted-foreground">{profile.occupation}</p>
                  </div>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">{profile.education}</p>
                  </div>
                </div>
              )}
              {profile.religion && (
                <div className="flex items-center gap-2">
                  <Church className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-medium">Religion</p>
                    <p className="text-sm text-muted-foreground">{profile.religion}</p>
                  </div>
                </div>
              )}
            </div>

            {profile.looking_for && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Looking For
                </h3>
                <p className="text-muted-foreground">{profile.looking_for}</p>
              </div>
            )}

            <form action={handleSendInterest}>
              <Button type="submit" className="w-full" size="lg">
                Express Interest
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
