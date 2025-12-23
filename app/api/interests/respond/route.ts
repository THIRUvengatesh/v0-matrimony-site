import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interestId, status } = await request.json()

    if (!interestId || !status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update interest status
    const { data, error } = await supabase
      .from("interests")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", interestId)
      .eq("receiver_id", session.user_id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Interest respond error:", error)
      return NextResponse.json({ error: "Failed to respond to interest" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Interest respond error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
