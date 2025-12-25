import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { EditProfileClient } from "@/components/edit-profile-client"

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  if (error || !profile) {
    redirect("/dashboard")
  }

  return <EditProfileClient profile={profile} />
}
