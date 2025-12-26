import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: communities, error } = await supabase
      .from("communities")
      .select("id, name")
      .order("name", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching communities:", error)
      return NextResponse.json({ error: "Failed to fetch communities" }, { status: 500 })
    }

    return NextResponse.json({ communities })
  } catch (error) {
    console.error("[v0] Communities API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
