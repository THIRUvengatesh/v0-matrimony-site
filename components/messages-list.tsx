"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

interface MessagesListProps {
  conversations: any[]
  currentConversationId?: string
  currentUserId: string
}

export function MessagesList({ conversations, currentConversationId, currentUserId }: MessagesListProps) {
  if (conversations.length === 0) {
    return (
      <div className="w-80 border-r bg-gray-50 flex flex-col items-center justify-center p-6">
        <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="font-semibold text-lg mb-2">No Messages Yet</h3>
        <p className="text-sm text-muted-foreground text-center">Start a conversation by visiting someone's profile</p>
      </div>
    )
  }

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Messages</h2>
        <p className="text-sm text-muted-foreground">{conversations.length} conversations</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y">
          {conversations.map((conv) => {
            const isActive = conv.id === currentConversationId
            const isFromMe = conv.lastMessage?.sender_id === currentUserId

            return (
              <Link
                key={conv.id}
                href={`/messages?conversationId=${conv.id}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  isActive ? "bg-rose-50 border-l-4 border-rose-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.otherUser?.profile_photo || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white">
                      {conv.otherUser?.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{conv.otherUser?.full_name}</h3>
                      {conv.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full"
                        >
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {conv.lastMessage && (
                      <>
                        <p className="text-sm text-muted-foreground truncate">
                          {isFromMe && "You: "}
                          {conv.lastMessage.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
