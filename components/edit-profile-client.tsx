"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { EditProfileForm } from "@/components/edit-profile-form"
import Link from "next/link"
import { User, ChevronDown } from "lucide-react"

interface Profile {
  id: string
  full_name: string
  profile_photo?: string
  photos?: string[]
  [key: string]: any
}

type Section =
  | "basic"
  | "education"
  | "family"
  | "hobbies"
  | "partner"
  | "location"
  | "email"
  | "contact"
  | "photos"
  | "horoscope"

export function EditProfileClient({ profile }: { profile: Profile }) {
  const [activeSection, setActiveSection] = useState<Section>("basic")
  const [expandedMenus, setExpandedMenus] = useState({
    profileInfo: true,
    contactDetails: false,
    enhanceProfile: false,
    trustBadge: false,
  })

  const photoCount = profile.photos?.length || 0

  const toggleMenu = (menu: keyof typeof expandedMenus) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  const handleSectionClick = (section: Section) => {
    setActiveSection(section)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader userName={profile.full_name} userPhoto={profile.profile_photo} />

      {/* Yellow Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-4 text-center text-sm">
        <span className="text-yellow-800">
          💡 Give Professional credibility to your profile with LinkedIn.{" "}
          <Link href="#" className="text-blue-600 hover:underline ml-1">
            Add Now »
          </Link>
        </span>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-4">
            {/* Profile Photo Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <div className="w-40 h-44 bg-gray-200 rounded mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {profile.profile_photo ? (
                  <img
                    src={profile.profile_photo || "/placeholder.svg"}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <User className="w-16 h-16 mb-2" />
                  </div>
                )}
              </div>
              <div className="bg-blue-500 text-white text-xs font-medium py-1 px-3 rounded">
                {profile.profile_photo ? "Edit Photo" : "Photo Not Added"}
              </div>
              <p className="text-xs text-gray-500 mt-2">Members would like to see you</p>
              <Link
                href="/dashboard/edit-profile/photos"
                className="mt-2 inline-block bg-rose-500 text-white text-xs font-medium py-1.5 px-4 rounded hover:bg-rose-600"
              >
                Add Photos
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* Profile Info Section */}
              <button
                onClick={() => toggleMenu("profileInfo")}
                className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-b"
              >
                <span>Profile Info</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedMenus.profileInfo ? "rotate-180" : ""}`}
                />
              </button>
              {expandedMenus.profileInfo && (
                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => handleSectionClick("basic")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "basic" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Basic Information</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                  <button
                    onClick={() => handleSectionClick("education")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "education" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Education & Occupation</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                  <button
                    onClick={() => handleSectionClick("family")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "family" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Family Details</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                  <button
                    onClick={() => handleSectionClick("hobbies")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "hobbies" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Hobbies & Interest</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                  <button
                    onClick={() => handleSectionClick("partner")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "partner" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Partner Preference</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                </div>
              )}

              {/* Contact Details Section */}
              <button
                onClick={() => toggleMenu("contactDetails")}
                className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2"
              >
                <span>Contact Details</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedMenus.contactDetails ? "rotate-180" : ""}`}
                />
              </button>
              {expandedMenus.contactDetails && (
                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => handleSectionClick("contact")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "contact" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Location & Contact</span>
                    <span className="text-xs text-blue-600 font-medium">edit</span>
                  </button>
                </div>
              )}

              {/* Enhance Profile Section */}
              <button
                onClick={() => toggleMenu("enhanceProfile")}
                className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2"
              >
                <span>Enhance Profile</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedMenus.enhanceProfile ? "rotate-180" : ""}`}
                />
              </button>
              {expandedMenus.enhanceProfile && (
                <div className="divide-y divide-gray-100">
                  <Link
                    href="/dashboard/edit-profile/photos"
                    className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <span>Photos ({photoCount}/10)</span>
                    <span className="text-xs text-blue-600 font-medium">add</span>
                  </Link>
                  <button
                    onClick={() => handleSectionClick("horoscope")}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                      activeSection === "horoscope" ? "bg-rose-50" : ""
                    }`}
                  >
                    <span>Horoscope</span>
                    <span className="text-xs text-blue-600 font-medium">add</span>
                  </button>
                </div>
              )}

              {/* Trust Badge Section */}
              <button
                onClick={() => toggleMenu("trustBadge")}
                className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm bg-gray-50 border-t border-b mt-2"
              >
                <span>Trust Badge</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedMenus.trustBadge ? "rotate-180" : ""}`}
                />
              </button>
              {expandedMenus.trustBadge && (
                <div className="divide-y divide-gray-100">
                  <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center text-xs">🆔</span>
                      Identity Badge
                    </span>
                    <span className="text-xs text-blue-600 font-medium">view</span>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">📄</span>
                      Professional Badge
                    </span>
                    <span className="text-xs text-blue-600 font-medium">add</span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h1 className="text-xl font-normal text-gray-700">Edit Profile</h1>
                <Link href={`/dashboard/profile/${profile.id}`} className="text-sm text-blue-600 hover:underline">
                  View my profile
                </Link>
              </div>

              <EditProfileForm profile={profile} activeSection={activeSection} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
