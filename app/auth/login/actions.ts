"use server"

import { createClient } from "@/lib/supabase/server"
import { hashPassword, createSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()
  const passwordHash = await hashPassword(password)

  // Find user with matching credentials
  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .eq("password_hash", passwordHash)
    .single()

  if (error || !user) {
    return { error: "Invalid email or password" }
  }

  // Create session
  await createSession(user.id)

  redirect("/dashboard")
}
