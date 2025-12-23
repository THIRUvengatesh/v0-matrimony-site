import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: plans, error } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching membership plans:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("[v0] Error in membership plans API:", error)
    return NextResponse.json({ error: "Failed to fetch membership plans" }, { status: 500 })
  }
}
