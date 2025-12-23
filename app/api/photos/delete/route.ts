import { del } from "@vercel/blob"
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

    // Delete from Vercel Blob
    await del(url)

    // Update profile photos in database
    const supabase = await createClient()

    // Get current photos array
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

    const { error } = await supabase.from("profiles").update(updateData).eq("user_id", session.user_id)

    if (error) {
      console.error("[v0] Database update error:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
