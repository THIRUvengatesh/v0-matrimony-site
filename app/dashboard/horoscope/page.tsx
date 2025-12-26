import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, Heart, Briefcase, Activity } from "lucide-react"
import Link from "next/link"
import { HoroscopeGenerator } from "@/components/horoscope-generator"

export default async function HoroscopePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  const hasAstrologicalData = profile?.date_of_birth && profile?.star && profile?.rassi

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/dashboard" className="text-red-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mb-2">Generate Your Horoscope</h1>
            <p className="text-gray-600">Get personalized astrological insights for your matrimony journey</p>
          </div>

          {!hasAstrologicalData ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Complete Your Astrological Details</h3>
                    <p className="text-gray-700 mb-4">
                      To generate your personalized horoscope, please complete your astrological information including
                      Date of Birth, Star (Nakshatra), and Raasi (Moon Sign).
                    </p>
                    <Link href="/dashboard/edit-profile">
                      <Button className="bg-yellow-600 hover:bg-yellow-700">Complete Profile</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Profile Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Your Astrological Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                      <p className="font-semibold">
                        {profile.date_of_birth
                          ? new Date(profile.date_of_birth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Star (Nakshatra)</p>
                      <p className="font-semibold capitalize">{profile.star || "N/A"}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Raasi (Moon Sign)</p>
                      <p className="font-semibold capitalize">{profile.rassi || "N/A"}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Gothra</p>
                      <p className="font-semibold">{profile.gothra || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Horoscope Generator Component */}
              <HoroscopeGenerator
                profile={profile}
                existingHoroscope={profile.horoscope_content}
                generatedAt={profile.horoscope_generated_at}
              />

              {/* Information Cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Relationship Insights</h3>
                    <p className="text-sm text-gray-600">Compatibility and love life predictions</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Career Prospects</h3>
                    <p className="text-sm text-gray-600">Professional growth and success</p>
                  </CardContent>
                </Card>
                <Card className="border-rose-200 bg-rose-50">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Health & Wellness</h3>
                    <p className="text-sm text-gray-600">Physical and mental well-being</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
