import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { randomBytes } from "crypto"

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demonstration - in production, use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function createSession(userId: string): Promise<string> {
  const supabase = await createClient()
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  const { error } = await supabase
    .from("sessions")
    .insert({ user_id: userId, token, expires_at: expiresAt.toISOString() })

  if (error) throw error

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  const supabase = await createClient()
  const { data: session } = await supabase
    .from("sessions")
    .select("*, users(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single()

  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (token) {
    const supabase = await createClient()
    await supabase.from("sessions").delete().eq("token", token)
  }

  cookieStore.delete("session_token")
}
