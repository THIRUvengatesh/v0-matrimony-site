import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { PhotoUploadClient } from "@/components/photo-upload-client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function PhotosPage() {
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard/edit-profile"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit Profile
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="mb-8 pb-4 border-b">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Photos</h1>
            <p className="text-sm text-gray-500 mt-2">
              Upload up to 10 photos. The first photo will be your profile picture.
            </p>
          </div>

          <PhotoUploadClient photos={profile.photos || []} />
        </div>
      </div>
    </div>
  )
}
