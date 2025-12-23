import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const supabase = await createClient()

    console.log("[v0] Updating profile for user:", session.user_id)

    const { error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user_id)

    if (error) {
      console.error("[v0] Profile update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Profile updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Profile update exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
