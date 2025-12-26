import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

function generateMockHoroscope(dateOfBirth: string, birthTime?: string) {
  const RASI = [
    "Mesham",
    "Rishabam",
    "Mithunam",
    "Kadagam",
    "Simmam",
    "Kanni",
    "Thulam",
    "Viruchigam",
    "Dhanusu",
    "Makaram",
    "Kumbam",
    "Meenam",
  ]

  // Simple hash function to generate consistent results for same birth date
  const hash = (str: string) => {
    let h = 0
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i)
      h |= 0
    }
    return Math.abs(h)
  }

  const seed = hash(dateOfBirth + (birthTime || ""))

  const getRaasi = (offset: number) => RASI[(seed + offset) % 12]
  const getDegree = (offset: number) => ((seed * (offset + 1)) % 3000) / 100

  return {
    sun: { raasi: getRaasi(0), degree: getDegree(0), house: 1 },
    moon: { raasi: getRaasi(1), degree: getDegree(1), house: 2 },
    mars: { raasi: getRaasi(2), degree: getDegree(2), house: 3 },
    mercury: { raasi: getRaasi(3), degree: getDegree(3), house: 4 },
    jupiter: { raasi: getRaasi(4), degree: getDegree(4), house: 5 },
    venus: { raasi: getRaasi(5), degree: getDegree(5), house: 6 },
    saturn: { raasi: getRaasi(6), degree: getDegree(6), house: 7 },
    rahu: { raasi: getRaasi(7), degree: getDegree(7), house: 8 },
    ketu: { raasi: getRaasi(8), degree: getDegree(8), house: 9 },
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting horoscope generation")
    const session = await getSession()

    if (!session) {
      console.log("[v0] No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Session found:", session.user_id)
    const supabase = await createClient()

    // Get user's profile with astrological details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user_id)
      .single()

    console.log("[v0] Profile query result:", { profile: !!profile, error: profileError })

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile.date_of_birth) {
      return NextResponse.json(
        {
          error: "Please complete your Date of Birth in the profile before generating horoscope",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Generating horoscope for DOB:", profile.date_of_birth)

    const horoscopeChart = generateMockHoroscope(profile.date_of_birth, profile.birth_time || undefined)

    const horoscopeText = `
VEDIC HOROSCOPE FOR ${profile.full_name || "User"}
Date of Birth: ${profile.date_of_birth}
${profile.birth_time ? `Birth Time: ${profile.birth_time}` : ""}
${profile.birth_place ? `Birth Place: ${profile.birth_place}` : ""}

═══════════════════════════════════════════════════════

PLANETARY POSITIONS

Sun (Surya):        ${horoscopeChart.sun.raasi} (${horoscopeChart.sun.degree.toFixed(2)}°)
Moon (Chandra):     ${horoscopeChart.moon.raasi} (${horoscopeChart.moon.degree.toFixed(2)}°)
Mars (Mangal):      ${horoscopeChart.mars.raasi} (${horoscopeChart.mars.degree.toFixed(2)}°)
Mercury (Budha):    ${horoscopeChart.mercury.raasi} (${horoscopeChart.mercury.degree.toFixed(2)}°)
Jupiter (Guru):     ${horoscopeChart.jupiter.raasi} (${horoscopeChart.jupiter.degree.toFixed(2)}°)
Venus (Shukra):     ${horoscopeChart.venus.raasi} (${horoscopeChart.venus.degree.toFixed(2)}°)
Saturn (Shani):     ${horoscopeChart.saturn.raasi} (${horoscopeChart.saturn.degree.toFixed(2)}°)
Rahu:               ${horoscopeChart.rahu.raasi} (${horoscopeChart.rahu.degree.toFixed(2)}°)
Ketu:               ${horoscopeChart.ketu.raasi} (${horoscopeChart.ketu.degree.toFixed(2)}°)

═══════════════════════════════════════════════════════

ASTROLOGICAL INSIGHTS

Moon Sign (Raasi): ${horoscopeChart.moon.raasi}
This placement indicates your emotional nature and mental characteristics.

${profile.star ? `Nakshatra (Birth Star): ${profile.star}\n` : ""}${profile.chevvai_dosham ? `Chevvai Dosham: ${profile.chevvai_dosham}\n` : ""}
PERSONALITY TRAITS
Your Moon in ${horoscopeChart.moon.raasi} suggests a balanced and harmonious personality.
You have strong family values and seek meaningful relationships.

MARRIAGE COMPATIBILITY
The planetary positions favor matrimonial harmony. Jupiter's placement
indicates blessings for married life and family prosperity.

CAREER & PROSPERITY  
Your chart shows favorable aspects for career growth and financial stability.
Mercury's position enhances communication and business acumen.

HEALTH & WELLNESS
Overall health indicators are positive. Saturn's placement suggests
discipline and longevity with proper care.

FAVORABLE PERIODS
The current planetary transits are auspicious for marriage proposals
and relationship commitments.

RECOMMENDATIONS
• Worship on auspicious days aligned with your Moon sign
• Consider gemstones: Pearl for Moon strength
• Maintain positive relationships with family elders
• Choose partners with compatible Moon signs

═══════════════════════════════════════════════════════

This horoscope is generated based on Vedic astrology principles.
`.trim()

    const predictions = {
      moon_sign: horoscopeChart.moon.raasi,
      planetary_positions: horoscopeChart,
      personality: "Based on astrological profile",
      career: "Favorable career prospects",
      love: "Strong relationship compatibility",
      health: "Good health indicators",
      marriage_timing: "Auspicious periods identified",
      lucky_items: {
        colors: ["Red", "Yellow"],
        numbers: [3, 7, 9],
        gemstones: ["Pearl", "Ruby", "Yellow Sapphire"],
      },
    }

    console.log("[v0] Saving horoscope to database")

    // Update profile with generated horoscope
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        horoscope_content: horoscopeText,
        horoscope_predictions: predictions,
        horoscope_generated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user_id)

    if (updateError) {
      console.error("[v0] Horoscope update error:", updateError)
      return NextResponse.json({ error: "Failed to save horoscope" }, { status: 500 })
    }

    console.log("[v0] Horoscope generated successfully")

    return NextResponse.json({
      success: true,
      horoscope: horoscopeText,
      predictions,
      chart: horoscopeChart,
    })
  } catch (error) {
    console.error("[v0] Horoscope generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate horoscope" },
      { status: 500 },
    )
  }
}
