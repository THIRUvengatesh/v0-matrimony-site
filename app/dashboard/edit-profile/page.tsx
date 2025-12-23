import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { EditProfileForm } from "@/components/edit-profile-form"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { User } from "lucide-react"

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  if (error || !profile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={profile.full_name} userPhoto={profile.profile_photo} />

      {/* Yellow Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-4 text-center text-sm">
        <span className="text-yellow-800">
          💡 Give Professional credibility to your profile with LinkedIn.{" "}
          <Link href="#" className="text-blue-600 hover:underline ml-1">
            Add Now »
          </Link>
        </span>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-4">
            {/* Profile Photo Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <div className="w-40 h-44 bg-gray-200 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {profile.profile_photo ? (
                  <img
                    src={profile.profile_photo || "/placeholder.svg"}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <User className="w-16 h-16 mb-2" />
                  </div>
                )}
              </div>
              <div className="bg-blue-500 text-white text-xs font-medium py-1 px-3 rounded">
                {profile.profile_photo ? "Edit Photo" : "Photo Not Added"}
              </div>
              <p className="text-xs text-gray-500 mt-2">Members would like to see you</p>
              <button className="mt-2 bg-rose-500 text-white text-xs font-medium py-1.5 px-4 rounded hover:bg-rose-600">
                Add Photos
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <button className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-b">
                <span>Profile Info</span>
                <span className="text-gray-400">▼</span>
              </button>
              <div className="divide-y divide-gray-100">
                <Link href="#basic" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Basic Information</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link
                  href="#education"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <span>Education & Occupation</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link href="#family" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Family Details</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link href="#hobbies" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Hobbies & Interest</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link href="#partner" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Partner Preference</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
              </div>

              <button className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2">
                <span>Contact Details</span>
                <span className="text-gray-400">▼</span>
              </button>
              <div className="divide-y divide-gray-100">
                <Link href="#location" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Location</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link href="#email" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>E-mail</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
                <Link href="#contact" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Contact Number</span>
                  <span className="text-xs text-blue-600 font-medium">edit</span>
                </Link>
              </div>

              <button className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2">
                <span>Enhance Profile</span>
                <span className="text-gray-400">▼</span>
              </button>
              <div className="divide-y divide-gray-100">
                <Link href="#photos" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span>Photos (0/10)</span>
                  <span className="text-xs text-blue-600 font-medium">add</span>
                </Link>
                <Link
                  href="#horoscope"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <span>Horoscope</span>
                  <span className="text-xs text-blue-600 font-medium">add</span>
                </Link>
              </div>

              <button className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2">
                <span>Trust Badge</span>
                <span className="text-gray-400">▼</span>
              </button>
              <div className="divide-y divide-gray-100">
                <Link href="#identity" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center text-xs">🆔</span>
                    Identity Badge
                  </span>
                  <span className="text-xs text-blue-600 font-medium">view</span>
                </Link>
                <Link
                  href="#professional"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">📄</span>
                    Professional Badge
                  </span>
                  <span className="text-xs text-blue-600 font-medium">add</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h1 className="text-xl font-normal text-gray-700">Edit Profile</h1>
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
