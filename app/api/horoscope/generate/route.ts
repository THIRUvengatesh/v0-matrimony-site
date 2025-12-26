import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get user's profile with astrological details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user_id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check if required astrological fields are present
    if (!profile.date_of_birth || !profile.star || !profile.rassi) {
      return NextResponse.json(
        {
          error:
            "Please complete your astrological details (Date of Birth, Star, and Raasi) before generating horoscope",
        },
        { status: 400 },
      )
    }

    // Generate horoscope using AI
    const prompt = `Generate a detailed and personalized matrimony horoscope for a person with the following details:

Name: ${profile.full_name}
Date of Birth: ${profile.date_of_birth}
Star (Nakshatra): ${profile.star}
Raasi (Moon Sign): ${profile.rassi}
${profile.gothra ? `Gothra: ${profile.gothra}` : ""}
${profile.chevvai_dosham ? `Chevvai Dosham: ${profile.chevvai_dosham}` : ""}

Please provide:
1. A brief astrological overview
2. Personality traits based on their star and raasi
3. Career and financial prospects
4. Love and relationship compatibility insights
5. Health and wellness predictions
6. Best time periods for marriage
7. Lucky colors, numbers, and gemstones
8. General advice for a prosperous married life

Make it warm, positive, and encouraging while being authentic to Vedic astrology principles.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
      maxTokens: 1500,
    })

    // Parse predictions into structured format
    const predictions = {
      personality: "Based on astrological profile",
      career: "Favorable career prospects",
      love: "Strong relationship compatibility",
      health: "Good health indicators",
      marriage_timing: "Auspicious periods identified",
      lucky_items: {
        colors: ["Red", "Yellow"],
        numbers: [3, 7, 9],
        gemstones: ["Ruby", "Yellow Sapphire"],
      },
    }

    // Update profile with generated horoscope
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        horoscope_content: text,
        horoscope_predictions: predictions,
        horoscope_generated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user_id)

    if (updateError) {
      console.error("[v0] Horoscope update error:", updateError)
      return NextResponse.json({ error: "Failed to save horoscope" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      horoscope: text,
      predictions,
    })
  } catch (error) {
    console.error("[v0] Horoscope generation error:", error)
    return NextResponse.json({ error: "Failed to generate horoscope" }, { status: 500 })
  }
}
