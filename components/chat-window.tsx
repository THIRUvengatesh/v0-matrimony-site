"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface ChatWindowProps {
  conversation: any
  messages: any[]
  currentUserId: string
}

export function ChatWindow({ conversation, messages: initialMessages, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !conversation) return

    setIsSending(true)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          receiverId:
            conversation.otherUser.user_id || conversation.user_id_1 === currentUserId
              ? conversation.user_id_2
              : conversation.user_id_1,
          content: newMessage,
        }),
      })

      if (response.ok) {
        const { message } = await response.json()
        setMessages([...messages, message])
        setNewMessage("")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <MessageSquare className="h-20 w-20 text-gray-300 mb-4" />
        <h3 className="font-semibold text-xl mb-2">Select a conversation</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.otherUser?.profile_photo || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white">
            {conversation.otherUser?.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{conversation.otherUser?.full_name}</h3>
          <p className="text-xs text-muted-foreground">{conversation.otherUser?.location}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isFromMe = message.sender_id === currentUserId

            return (
              <div key={message.id} className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isFromMe ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isFromMe ? "bg-rose-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isFromMe ? "text-right" : "text-left"}`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="bg-rose-500 hover:bg-rose-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
