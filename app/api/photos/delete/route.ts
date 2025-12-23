import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    const supabase = await createClient()

    // Extract filename from public URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/profile-photos/{filename}
    const urlParts = url.split("/storage/v1/object/public/profile-photos/")
    if (urlParts.length !== 2) {
      return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 })
    }
    const filename = decodeURIComponent(urlParts[1])

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage.from("profile-photos").remove([filename])

    if (deleteError) {
      console.error("[v0] Storage delete error:", deleteError)
      throw deleteError
    }

    // Update profile photos in database
    const { data: profile } = await supabase
      .from("profiles")
      .select("photos, profile_photo")
      .eq("user_id", session.user_id)
      .single()

    const currentPhotos = profile?.photos || []
    const updatedPhotos = currentPhotos.filter((photo: string) => photo !== url)

    // Update photos array and profile_photo if needed
    const updateData: any = { photos: updatedPhotos }
    if (profile?.profile_photo === url) {
      updateData.profile_photo = updatedPhotos[0] || null
    }

    const { error: dbError } = await supabase.from("profiles").update(updateData).eq("user_id", session.user_id)

    if (dbError) {
      console.error("[v0] Database update error:", dbError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
