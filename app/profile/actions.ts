"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const updates = {
    full_name: formData.get("fullName") as string,
    height: formData.get("height") ? Number.parseInt(formData.get("height") as string) : null,
    religion: formData.get("religion") as string,
    occupation: formData.get("occupation") as string,
    education: formData.get("education") as string,
    location: formData.get("location") as string,
    bio: formData.get("bio") as string,
    looking_for: formData.get("lookingFor") as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("profiles").update(updates).eq("user_id", session.user_id)

  if (error) {
    return { error: "Failed to update profile" }
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
  redirect("/dashboard")
}
