"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface InterestCardProps {
  interest: any
  type: "sent" | "received" | "accepted"
}

export function InterestCard({ interest, type }: InterestCardProps) {
  const [status, setStatus] = useState(interest.status)
  const [isResponding, setIsResponding] = useState(false)

  const profile = type === "sent" ? interest.receiver : interest.sender
  const otherProfile =
    type === "accepted" ? (interest.sender_id !== profile.user_id ? interest.sender : interest.receiver) : null

  const handleRespond = async (responseStatus: "accepted" | "rejected") => {
    setIsResponding(true)
    try {
      const response = await fetch("/api/interests/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestId: interest.id,
          status: responseStatus,
        }),
      })

      if (response.ok) {
        setStatus(responseStatus)
      } else {
        alert("Failed to respond to interest")
      }
    } catch (error) {
      console.error("Failed to respond:", error)
      alert("Failed to respond to interest")
    } finally {
      setIsResponding(false)
    }
  }

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const displayProfile = otherProfile || profile

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Link href={`/profile/${displayProfile.id}`}>
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white text-xl">
                {displayProfile.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link href={`/profile/${displayProfile.id}`}>
                  <h3 className="font-semibold text-lg hover:text-rose-600 transition-colors">
                    {displayProfile.full_name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {calculateAge(displayProfile.date_of_birth)} yrs • {displayProfile.location || "N/A"}
                </p>
              </div>

              <Badge
                variant={status === "accepted" ? "default" : status === "rejected" ? "destructive" : "secondary"}
                className={status === "accepted" ? "bg-green-500" : ""}
              >
                {status === "pending" ? "Pending" : status === "accepted" ? "Accepted" : "Rejected"}
              </Badge>
            </div>

            {interest.message && <p className="text-sm text-muted-foreground mb-3 italic">"{interest.message}"</p>}

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>{new Date(interest.created_at).toLocaleDateString()}</span>
            </div>

            {type === "received" && status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleRespond("accepted")}
                  disabled={isResponding}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRespond("rejected")}
                  disabled={isResponding}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}

            {status === "accepted" && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/messages?user=${displayProfile.user_id}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send Message
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
