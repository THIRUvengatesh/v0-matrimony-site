import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Home,
  Users,
  Heart,
  MessageSquare,
  Search,
  Bell,
  User,
  ChevronDown,
  ImagePlus,
  Star,
  UsersRound,
  Settings,
  Crown,
  ChevronRight,
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("user_id", session.user_id).single()

  // Get all other profiles (potential matches)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("user_id", session.user_id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate profile completeness
  const calculateCompleteness = (profile: any) => {
    const fields = [
      profile.full_name,
      profile.date_of_birth,
      profile.gender,
      profile.height,
      profile.religion,
      profile.occupation,
      profile.education,
      profile.location,
      profile.bio,
    ]
    const filledFields = fields.filter((field) => field && field !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completeness = currentProfile ? calculateCompleteness(currentProfile) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 rounded-lg p-2 flex items-center justify-center">
              <UsersRound className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">MatchMatrimony.com</h1>
              <p className="text-xs text-muted-foreground">From Matrimony.com Group</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-red-500 font-medium">
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link href="/matches" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Users className="h-5 w-5" />
              Matches
            </Link>
            <Link href="/interests" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Heart className="h-5 w-5" />
              Interests
            </Link>
            <Link href="/messages" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <MessageSquare className="h-5 w-5" />
              Messages
            </Link>
            <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
              Search
            </Link>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              Notification
            </button>
          </nav>

          <button className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-300 text-blue-900">
                {currentProfile?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <Card className="mb-4">
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-3">
                <AvatarFallback className="bg-blue-300 text-blue-900 text-2xl">
                  {currentProfile?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-lg mb-1">{currentProfile?.full_name || "User"}</h2>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <UsersRound className="h-3 w-3 text-white" />
                </div>
                MatchMatrimony
              </div>
              <p className="font-semibold text-gray-900">VTU{session.user_id.slice(0, 6)}</p>
              <p className="text-sm text-muted-foreground">Free member</p>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-red-50 border-red-100">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-3">Upgrade membership to call/chat with matches</p>
              <Link href="/upgrade">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">Upgrade now</Button>
              </Link>
              <Crown className="h-8 w-8 text-red-300 ml-auto mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <Link href="/dashboard/edit-profile">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <Search className="h-4 w-4 mr-2" />
                Edit Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                <Star className="h-4 w-4 mr-2" />
                Generate Horoscope
              </Button>

              <div className="pt-4 pb-2">
                <p className="text-sm font-medium text-gray-600 px-3">Support & feedback</p>
              </div>

              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-gray-900">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>

              <form action="/auth/logout" method="POST" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                  Logout
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Complete Your Profile */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Complete Your Profile</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Profile completeness score</span>
                    <span className="font-semibold">{completeness}%</span>
                  </div>
                </div>
              </div>
              <Progress value={completeness} className="mb-6 h-2" />

              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ImagePlus className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium text-sm">Add Photo(s)</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-sm">Add Horoscope</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <UsersRound className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="font-medium text-sm">Family Details</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Recommendations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Daily Recommendations</h2>
                  <p className="text-sm text-muted-foreground">Recommended matches for today</p>
                </div>
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium">
                  <div>Time left to view</div>
                  <div className="text-center font-bold">00h:43m:27s</div>
                </div>
              </div>

              {/* Horizontal scrollable carousel */}
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {profiles?.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/profile/${profile.id}`}
                      className="flex-shrink-0 w-56 group cursor-pointer"
                    >
                      <div className="rounded-lg overflow-hidden mb-3 relative aspect-[3/4] bg-gray-200">
                        <Avatar className="h-full w-full rounded-none">
                          <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white text-4xl rounded-none">
                            {profile.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-semibold text-base mb-0.5 group-hover:text-red-600 transition-colors">
                        {profile.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {calculateAge(profile.date_of_birth)} Yrs, {profile.height || "N/A"}
                      </p>
                    </Link>
                  ))}
                </div>

                {profiles && profiles.length > 4 && (
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                )}
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="px-8 border-red-200 text-red-600 hover:bg-red-50 rounded-full bg-transparent"
                >
                  View all →
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
