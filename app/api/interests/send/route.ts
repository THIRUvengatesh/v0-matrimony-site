import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, message } = await request.json()

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if interest already exists
    const { data: existingInterest } = await supabase
      .from("interests")
      .select("*")
      .eq("sender_id", session.user_id)
      .eq("receiver_id", receiverId)
      .single()

    if (existingInterest) {
      return NextResponse.json({ error: "Interest already sent" }, { status: 400 })
    }

    // Create new interest
    const { data, error } = await supabase
      .from("interests")
      .insert({
        sender_id: session.user_id,
        receiver_id: receiverId,
        message: message || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Interest send error:", error)
      return NextResponse.json({ error: "Failed to send interest" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Interest send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
