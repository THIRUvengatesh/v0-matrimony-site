"use server"

import { createClient } from "@/lib/supabase/server"
import { hashPassword, createSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const dateOfBirth = formData.get("dateOfBirth") as string
  const gender = formData.get("gender") as string

  const supabase = await createClient()

  // Check if email already exists
  const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

  if (existingUser) {
    return { error: "Email already registered" }
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password)
  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({ email, password_hash: passwordHash })
    .select()
    .single()

  if (userError || !user) {
    return { error: "Failed to create account" }
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: user.id,
    full_name: fullName,
    date_of_birth: dateOfBirth,
    gender,
  })

  if (profileError) {
    return { error: "Failed to create profile" }
  }

  // Create session
  await createSession(user.id)

  redirect("/dashboard")
}
