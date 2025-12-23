import Link from "next/link"
import { Home, Users, Heart, MessageSquare, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SiteHeaderProps {
  userName?: string
  userPhoto?: string
}

export function SiteHeader({ userName, userPhoto }: SiteHeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-base">VettuvagounderMatrimony.com</div>
              <div className="text-xs text-muted-foreground">From Matrimony.com Group</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/matches" className="flex items-center gap-2 text-sm font-medium hover:text-rose-500">
              <Users className="w-4 h-4" />
              Matches
            </Link>
            <Link href="/interests" className="flex items-center gap-2 text-sm font-medium hover:text-rose-500">
              <Heart className="w-4 h-4" />
              Interests
            </Link>
            <Link href="/messages" className="flex items-center gap-2 text-sm font-medium hover:text-rose-500">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Link>
            <Link href="/search" className="flex items-center gap-2 text-sm font-medium hover:text-rose-500">
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-medium">
              <Bell className="w-4 h-4" />
              Notification
            </Button>
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={userPhoto || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/edit-profile">Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/auth/logout" method="POST">
                  <button type="submit" className="w-full text-left">
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
