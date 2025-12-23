import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

// POST: Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId, receiverId, content } = await request.json()
    const senderId = session.user_id

    if (!conversationId || !receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user is part of the conversation
    const { data: conversation } = await supabase.from("conversations").select("*").eq("id", conversationId).single()

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conversation.user_id_1 !== senderId && conversation.user_id_2 !== senderId) {
      return NextResponse.json({ error: "Unauthorized to send in this conversation" }, { status: 403 })
    }

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error sending message:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error("[v0] Error in send message:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
