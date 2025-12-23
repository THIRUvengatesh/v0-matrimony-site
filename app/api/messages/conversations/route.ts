import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

// GET: Get all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const userId = session.user_id

    // Get all conversations where user is participant
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        user_id_1,
        user_id_2,
        last_message_at,
        created_at
      `)
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .order("last_message_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching conversations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the other user's profile and last message for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.user_id_1 === userId ? conv.user_id_2 : conv.user_id_1

        // Get other user's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, profile_photo, location")
          .eq("user_id", otherUserId)
          .single()

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, created_at, sender_id, is_read")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("receiver_id", userId)
          .eq("is_read", false)

        return {
          ...conv,
          otherUser: profile,
          lastMessage,
          unreadCount: unreadCount || 0,
        }
      }),
    )

    return NextResponse.json({ conversations: conversationsWithDetails })
  } catch (error: any) {
    console.error("[v0] Error in conversations API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { otherUserId } = await request.json()
    const userId = session.user_id

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(user_id_1.eq.${userId},user_id_2.eq.${otherUserId}),and(user_id_1.eq.${otherUserId},user_id_2.eq.${userId})`,
      )
      .single()

    if (existingConv) {
      return NextResponse.json({ conversationId: existingConv.id })
    }

    // Create new conversation (always put smaller UUID first for consistency)
    const [smallerId, largerId] = [userId, otherUserId].sort()

    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        user_id_1: smallerId,
        user_id_2: largerId,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating conversation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversationId: newConv.id })
  } catch (error: any) {
    console.error("[v0] Error in create conversation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
