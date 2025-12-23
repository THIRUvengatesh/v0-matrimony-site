import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Upload to Vercel Blob with user-specific path
    const filename = `${session.user_id}/${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    // Update profile photos in database
    const supabase = await createClient()

    // Get current photos array
    const { data: profile } = await supabase.from("profiles").select("photos").eq("user_id", session.user_id).single()

    const currentPhotos = profile?.photos || []
    const updatedPhotos = [...currentPhotos, blob.url]

    // Update photos array and set profile_photo if this is the first photo
    const updateData: any = { photos: updatedPhotos }
    if (currentPhotos.length === 0) {
      updateData.profile_photo = blob.url
    }

    const { error } = await supabase.from("profiles").update(updateData).eq("user_id", session.user_id)

    if (error) {
      console.error("[v0] Database update error:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
