import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { profileId } = await request.json()

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Add to shortlist
    const { data, error } = await supabase
      .from("shortlist")
      .insert({
        user_id: session.user_id,
        profile_id: profileId,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already in shortlist" }, { status: 400 })
      }
      console.error("[v0] Shortlist add error:", error)
      return NextResponse.json({ error: "Failed to add to shortlist" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Shortlist add error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("profileId")

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Remove from shortlist
    const { error } = await supabase
      .from("shortlist")
      .delete()
      .eq("user_id", session.user_id)
      .eq("profile_id", profileId)

    if (error) {
      console.error("[v0] Shortlist remove error:", error)
      return NextResponse.json({ error: "Failed to remove from shortlist" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Shortlist remove error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
