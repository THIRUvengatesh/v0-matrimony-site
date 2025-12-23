import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { updateProfile } from "./actions"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfile}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" defaultValue={profile?.full_name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" defaultValue={profile?.height || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input id="religion" name="religion" defaultValue={profile?.religion || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" name="occupation" defaultValue={profile?.occupation || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" name="education" defaultValue={profile?.education || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={profile?.location || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={profile?.bio || ""}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lookingFor">Looking For</Label>
                  <Textarea
                    id="lookingFor"
                    name="lookingFor"
                    rows={3}
                    defaultValue={profile?.looking_for || ""}
                    placeholder="Describe your ideal partner..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
