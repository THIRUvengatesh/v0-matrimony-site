import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { User, MapPin, GraduationCap, Heart, Home, Phone, Mail, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfileViewPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  if (error || !profile) {
    redirect("/dashboard")
  }

  const isOwnProfile = profile.user_id === session.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={profile.full_name} userPhoto={profile.profile_photo} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {isOwnProfile && (
            <div className="flex justify-end mb-4">
              <Link
                href="/dashboard/edit-profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* Left Sidebar - Profile Card */}
            <aside>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {profile.profile_photo ? (
                        <img
                          src={profile.profile_photo || "/placeholder.svg"}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-24 h-24 text-gray-400" />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.full_name}</h2>
                    <p className="text-sm text-gray-500 mb-4">ID: {profile.id.slice(0, 8).toUpperCase()}</p>

                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">Age:</span>
                        <span className="text-gray-600">{profile.age} years</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">Height:</span>
                        <span className="text-gray-600">{profile.height} cm</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">Religion:</span>
                        <span className="text-gray-600">{profile.religion || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="text-gray-600">{profile.location || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-gray-900">{profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Gender</p>
                    <p className="text-gray-900">{profile.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                    <p className="text-gray-900">{profile.date_of_birth || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Age</p>
                    <p className="text-gray-900">{profile.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Marital Status</p>
                    <p className="text-gray-900">{profile.marital_status || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Height</p>
                    <p className="text-gray-900">{profile.height} cm</p>
                  </div>
                  {profile.weight_kg && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Weight</p>
                      <p className="text-gray-900">{profile.weight_kg} kg</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Physical Status</p>
                    <p className="text-gray-900">{profile.physical_status || "Not specified"}</p>
                  </div>
                  {profile.mother_tongue && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mother Tongue</p>
                      <p className="text-gray-900">{profile.mother_tongue}</p>
                    </div>
                  )}
                  {profile.subcaste && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Subcaste</p>
                      <p className="text-gray-900">{profile.subcaste}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education & Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-rose-500" />
                    Education & Career
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Education</p>
                    <p className="text-gray-900">{profile.education || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Occupation</p>
                    <p className="text-gray-900">{profile.occupation || "Not specified"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              {profile.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-rose-500" />
                    Lifestyle & Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {profile.eating_habits && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Eating Habits</p>
                      <p className="text-gray-900">{profile.eating_habits}</p>
                    </div>
                  )}
                  {profile.drinking_habits && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Drinking Habits</p>
                      <p className="text-gray-900">{profile.drinking_habits}</p>
                    </div>
                  )}
                  {profile.smoking_habits && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Smoking Habits</p>
                      <p className="text-gray-900">{profile.smoking_habits}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Astrology */}
              {(profile.star || profile.raasi || profile.gothra) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-rose-500">✨</span>
                      Astrology Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {profile.star && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Star</p>
                        <p className="text-gray-900">{profile.star}</p>
                      </div>
                    )}
                    {profile.raasi && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Raasi</p>
                        <p className="text-gray-900">{profile.raasi}</p>
                      </div>
                    )}
                    {profile.gothra && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Gothra</p>
                        <p className="text-gray-900">{profile.gothra}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-rose-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-gray-900">{profile.location || "Not specified"}</p>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-gray-900">{profile.email || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Phone</p>
                          <p className="text-gray-900">{profile.phone || "Not specified"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
