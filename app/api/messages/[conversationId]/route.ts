import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

// GET: Get messages for a specific conversation
export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId } = await params
    const userId = session.user_id

    const supabase = await createClient()

    // Verify user is part of the conversation
    const { data: conversation } = await supabase.from("conversations").select("*").eq("id", conversationId).single()

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conversation.user_id_1 !== userId && conversation.user_id_2 !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching messages:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", userId)
      .eq("is_read", false)

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error("[v0] Error in get messages:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
