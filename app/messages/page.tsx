import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { MessagesList } from "@/components/messages-list"
import { ChatWindow } from "@/components/chat-window"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversationId?: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { conversationId } = await searchParams

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  // Get all conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .or(`user_id_1.eq.${session.user_id},user_id_2.eq.${session.user_id}`)
    .order("last_message_at", { ascending: false })

  // Get conversation details with profiles and last messages
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv) => {
      const otherUserId = conv.user_id_1 === session.user_id ? conv.user_id_2 : conv.user_id_1

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, profile_photo, location")
        .eq("user_id", otherUserId)
        .single()

      const { data: lastMessage } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("receiver_id", session.user_id)
        .eq("is_read", false)

      return {
        ...conv,
        otherUser: profile,
        lastMessage,
        unreadCount: unreadCount || 0,
      }
    }),
  )

  // Get current conversation details
  let currentConversation = null
  let messages = []

  if (conversationId) {
    currentConversation = conversationsWithDetails.find((c) => c.id === conversationId)

    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    messages = messagesData || []

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", session.user_id)
      .eq("is_read", false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={currentProfile?.full_name} userPhoto={currentProfile?.profile_photo} />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <MessagesList
              conversations={conversationsWithDetails}
              currentConversationId={conversationId}
              currentUserId={session.user_id}
            />

            {/* Chat Window */}
            <ChatWindow conversation={currentConversation} messages={messages} currentUserId={session.user_id} />
          </div>
        </div>
      </div>
    </div>
  )
}
