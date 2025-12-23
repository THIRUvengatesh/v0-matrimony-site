"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Match {
  id: string
  user_id: string
  full_name: string
  date_of_birth: string
  gender: string
  height: number
  occupation: string
  location: string
  photos?: string[]
}

interface MatchesGridProps {
  matches: Match[]
  currentUserId: string
}

export function MatchesGrid({ matches, currentUserId }: MatchesGridProps) {
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set())

  const handleShortlist = async (profileId: string) => {
    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      })

      if (response.ok) {
        setShortlisted((prev) => new Set(prev).add(profileId))
      }
    } catch (error) {
      console.error("Failed to shortlist:", error)
    }
  }

  const handleSendInterest = async (receiverId: string) => {
    try {
      const response = await fetch("/api/interests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      })

      if (response.ok) {
        alert("Interest sent successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to send interest")
      }
    } catch (error) {
      console.error("Failed to send interest:", error)
      alert("Failed to send interest")
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {matches.map((match) => (
        <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/profile/${match.id}`}>
            <div className="aspect-[3/4] bg-gradient-to-br from-rose-200 to-pink-200 relative">
              <Avatar className="h-full w-full rounded-none">
                <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white text-4xl rounded-none">
                  {match.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleShortlist(match.user_id)
                }}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              >
                <Star
                  className={`h-5 w-5 ${shortlisted.has(match.user_id) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                />
              </button>
            </div>
          </Link>

          <CardContent className="p-4">
            <Link href={`/profile/${match.id}`}>
              <h3 className="font-semibold text-lg mb-1 hover:text-rose-600 transition-colors">{match.full_name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-3">
              {calculateAge(match.date_of_birth)} yrs • {match.height ? `${match.height} cm` : "N/A"}
            </p>

            {match.occupation && (
              <Badge variant="secondary" className="mb-3">
                {match.occupation}
              </Badge>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleSendInterest(match.user_id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                Interest
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href={`/messages?user=${match.user_id}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
