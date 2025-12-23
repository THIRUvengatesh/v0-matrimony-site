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

    // Initialize Supabase client
    const supabase = await createClient()

    // Create file path with user ID for organization
    const filename = `${session.user_id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Convert File to ArrayBuffer for Supabase
    const buffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Storage upload error:", uploadError)
      throw uploadError
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-photos").getPublicUrl(filename)

    // Update profile photos in database
    const { data: profile } = await supabase.from("profiles").select("photos").eq("user_id", session.user_id).single()

    const currentPhotos = profile?.photos || []
    const updatedPhotos = [...currentPhotos, publicUrl]

    // Update photos array and set profile_photo if this is the first photo
    const updateData: any = { photos: updatedPhotos }
    if (currentPhotos.length === 0) {
      updateData.profile_photo = publicUrl
    }

    const { error: dbError } = await supabase.from("profiles").update(updateData).eq("user_id", session.user_id)

    if (dbError) {
      console.error("[v0] Database update error:", dbError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
