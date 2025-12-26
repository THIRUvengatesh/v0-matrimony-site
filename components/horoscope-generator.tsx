"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Download, Share2, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface HoroscopeGeneratorProps {
  profile: any
  existingHoroscope?: string | null
  generatedAt?: string | null
}

export function HoroscopeGenerator({ profile, existingHoroscope, generatedAt }: HoroscopeGeneratorProps) {
  const [horoscope, setHoroscope] = useState(existingHoroscope || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState(generatedAt || null)

  const generateHoroscope = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/horoscope/generate", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to generate horoscope",
          variant: "destructive",
        })
        return
      }

      setHoroscope(data.horoscope)
      setLastGenerated(new Date().toISOString())

      toast({
        title: "Success!",
        description: "Your personalized horoscope has been generated",
      })
    } catch (error) {
      console.error("[v0] Horoscope generation error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadHoroscope = () => {
    const blob = new Blob([horoscope], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${profile.full_name}-horoscope.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Your horoscope has been downloaded",
    })
  }

  const shareHoroscope = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Horoscope",
          text: horoscope,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(horoscope)
      toast({
        title: "Copied",
        description: "Horoscope copied to clipboard",
      })
    }
  }

  return (
    <>
      {/* Generate Button */}
      {!horoscope && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generate Your Personalized Horoscope</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get AI-powered astrological insights based on your Vedic astrology details to guide your matrimony
              journey.
            </p>
            <Button
              onClick={generateHoroscope}
              disabled={isGenerating}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Horoscope
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Horoscope Display */}
      {horoscope && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Your Personalized Horoscope
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadHoroscope}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={shareHoroscope}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateHoroscope}
                  disabled={isGenerating}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </div>
            </div>
            {lastGenerated && (
              <p className="text-sm text-gray-500 mt-1">
                Generated on{" "}
                {new Date(lastGenerated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-purple max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{horoscope}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
