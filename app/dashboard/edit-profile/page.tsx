import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { EditProfileForm } from "@/components/edit-profile-form"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = createServerClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", session.userId).single()

  if (error || !profile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader userName={profile.full_name} userPhoto={profile.profile_photo} />

      {/* Yellow Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 py-3 px-4 text-center text-sm">
        <span className="text-yellow-800">
          💡 Give Professional credibility to your profile with LinkedIn.{" "}
          <Link href="#" className="text-blue-600 hover:underline ml-1">
            Add Now »
          </Link>
        </span>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-4">
            {/* Profile Photo Card */}
            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {profile.profile_photo ? (
                  <img
                    src={profile.profile_photo || "/placeholder.svg"}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <Button variant="destructive" size="sm" className="bg-rose-500 hover:bg-rose-600">
                Edit Photos
              </Button>
            </div>

            {/* Navigation Menu */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="border-b px-4 py-3 font-semibold text-sm">Profile Info</div>
              <div className="divide-y">
                <Link href="#basic" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Basic Information</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link
                  href="#education"
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <span>Education & Occupation</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link href="#family" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Family Details</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link href="#hobbies" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Hobbies & Interest</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link href="#partner" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Partner Preference</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
              </div>

              <div className="border-t border-b px-4 py-3 font-semibold text-sm mt-4">Contact Details</div>
              <div className="divide-y">
                <Link href="#location" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Location</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link href="#email" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>E-mail</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
                <Link href="#contact" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Contact Number</span>
                  <span className="text-xs text-blue-600">edit</span>
                </Link>
              </div>

              <div className="border-t border-b px-4 py-3 font-semibold text-sm mt-4">Enhance Profile</div>
              <div className="divide-y">
                <Link href="#photos" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span>Photos (1/10)</span>
                  <span className="text-xs text-blue-600">add</span>
                </Link>
                <Link
                  href="#horoscope"
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <span>Horoscope</span>
                  <span className="text-xs text-blue-600">add</span>
                </Link>
              </div>

              <div className="border-t px-4 py-3 font-semibold text-sm mt-4">Trust Badge</div>
              <div className="divide-y">
                <Link href="#identity" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <span className="text-rose-500">🆔</span>
                    Identity Badge
                  </span>
                  <span className="text-xs text-blue-600">view</span>
                </Link>
                <Link
                  href="#professional"
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">📄</span>
                    Professional Badge
                  </span>
                  <span className="text-xs text-blue-600">add</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Edit Profile</h1>
                <Link href={`/dashboard/profile/${profile.id}`} className="text-sm text-blue-600 hover:underline">
                  View my profile
                </Link>
              </div>

              <EditProfileForm profile={profile} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
