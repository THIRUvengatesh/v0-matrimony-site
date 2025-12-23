"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Profile {
  id: string
  full_name: string
  date_of_birth: string
  gender: string
  height?: number
  profile_created_by?: string
  marital_status?: string
  weight_kg?: number
  physical_status?: string
  subcaste?: string
  mother_tongue?: string
  languages_known?: string[]
  gothra?: string
  star?: string
  rassi?: string
  chevvai_dosham?: string
  eating_habits?: string
  smoking_habits?: string
  drinking_habits?: string
  about_me?: string
  religion?: string
  occupation?: string
  education?: string
  location?: string
  phone_number?: string
}

const LANGUAGES = [
  "Assamese",
  "Bengali",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Odia",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Urdu",
]

const HEIGHTS = [
  "4'0\"",
  "4'1\"",
  "4'2\"",
  "4'3\"",
  "4'4\"",
  "4'5\"",
  "4'6\"",
  "4'7\"",
  "4'8\"",
  "4'9\"",
  "4'10\"",
  "4'11\"",
  "5'0\"",
  "5'1\"",
  "5'2\"",
  "5'3\"",
  "5'4\"",
  "5'5\"",
  "5'6\"",
  "5'7\"",
  "5'8\"",
  "5'9\"",
  "5'10\"",
  "5'11\"",
  "6'0\"",
  "6'1\"",
  "6'2\"",
  "6'3\"",
  "6'4\"",
  "6'5\"",
  "6'6\"",
  "6'7\"",
  "6'8\"",
  "6'9\"",
  "6'10\"",
  "6'11\"",
  "7'0\"",
]

export function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profile.languages_known || [])

  const birthDate = profile.date_of_birth ? new Date(profile.date_of_birth) : new Date()
  const [day, setDay] = useState(birthDate.getDate().toString())
  const [month, setMonth] = useState((birthDate.getMonth() + 1).toString())
  const [year, setYear] = useState(birthDate.getFullYear().toString())

  const [aboutMe, setAboutMe] = useState(profile.about_me || "")

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      profile_created_by: formData.get("profile_created_by"),
      full_name: formData.get("full_name"),
      date_of_birth: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      marital_status: formData.get("marital_status"),
      height: formData.get("height"),
      weight_kg: formData.get("weight_kg"),
      physical_status: formData.get("physical_status"),
      subcaste: formData.get("subcaste"),
      mother_tongue: formData.get("mother_tongue"),
      languages_known: selectedLanguages,
      gothra: formData.get("gothra"),
      star: formData.get("star"),
      rassi: formData.get("rassi"),
      chevvai_dosham: formData.get("chevvai_dosham"),
      eating_habits: formData.get("eating_habits"),
      smoking_habits: formData.get("smoking_habits"),
      drinking_habits: formData.get("drinking_habits"),
      about_me: aboutMe,
      occupation: formData.get("occupation"),
      education: formData.get("education"),
      location: formData.get("location"),
      phone_number: formData.get("phone_number"),
    }

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <p className="text-xs text-muted-foreground mb-6">
          Fields marked as <span className="text-red-500">*</span> are Mandatory
        </p>

        <div className="space-y-6">
          {/* Profile Created By */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="profile_created_by">
              Profile created by <span className="text-red-500">*</span>
            </Label>
            <Select name="profile_created_by" defaultValue={profile.profile_created_by || "self"}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="parents">Parents</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="full_name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input id="full_name" name="full_name" defaultValue={profile.full_name} className="max-w-md" required />
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label>
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - 18 - i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Marital Status */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>
              Marital Status <span className="text-red-500">*</span>
            </Label>
            <RadioGroup name="marital_status" defaultValue={profile.marital_status || "unmarried"}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unmarried" id="unmarried" />
                  <Label htmlFor="unmarried" className="font-normal">
                    Unmarried
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="widow_widower" id="widow_widower" />
                  <Label htmlFor="widow_widower" className="font-normal">
                    Widow / Widower
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="divorced" id="divorced" />
                  <Label htmlFor="divorced" className="font-normal">
                    Divorced
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="separated" id="separated" />
                  <Label htmlFor="separated" className="font-normal">
                    Separated
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Height */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="height">
              Height <span className="text-red-500">*</span>
            </Label>
            <Select name="height" defaultValue={profile.height?.toString() || "165"}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEIGHTS.map((h, i) => (
                  <SelectItem key={i} value={(122 + i * 2.54).toString()}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="weight_kg">Weight</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="weight_kg"
                name="weight_kg"
                type="number"
                defaultValue={profile.weight_kg || ""}
                placeholder="70"
                className="w-[100px]"
              />
              <span className="text-sm">kg</span>
              <span className="text-muted-foreground mx-2">or</span>
              <Input type="number" placeholder="Lbs" className="w-[100px]" disabled />
            </div>
          </div>

          {/* Physical Status */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>
              Physical Status <span className="text-red-500">*</span>
            </Label>
            <RadioGroup name="physical_status" defaultValue={profile.physical_status || "normal"}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="font-normal">
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="physically_challenged" id="physically_challenged" />
                  <Label htmlFor="physically_challenged" className="font-normal">
                    Physically Challenged
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Subcaste */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="subcaste">Subcaste</Label>
            <Input id="subcaste" name="subcaste" defaultValue={profile.subcaste || ""} className="max-w-md" />
          </div>

          {/* Mother Tongue */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="mother_tongue">
              Mother Tongue <span className="text-red-500">*</span>
            </Label>
            <Select name="mother_tongue" defaultValue={profile.mother_tongue || "Tamil"}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Languages Known */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>Languages Known</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {LANGUAGES.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`lang-${lang}`}
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => handleLanguageToggle(lang)}
                        className="rounded"
                      />
                      <label htmlFor={`lang-${lang}`} className="text-sm">
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                <p className="text-sm text-muted-foreground">Double click on the values to deselect.</p>
                {selectedLanguages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedLanguages.map((lang) => (
                      <div key={lang} className="text-sm">
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gothras */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="gothra">Gothras</Label>
            <Input
              id="gothra"
              name="gothra"
              defaultValue={profile.gothra || ""}
              className="max-w-md"
              placeholder="Optional but recommended"
            />
          </div>

          {/* Star */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="star">Star</Label>
            <Select name="star" defaultValue={profile.star || ""}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select star" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visakam">Visakam</SelectItem>
                <SelectItem value="rohini">Rohini</SelectItem>
                <SelectItem value="ashwini">Ashwini</SelectItem>
                <SelectItem value="bharani">Bharani</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rassi */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="rassi">Rassi</Label>
            <Select name="rassi" defaultValue={profile.rassi || ""}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select rassi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tula">Tula (Libra)</SelectItem>
                <SelectItem value="mesha">Mesha (Aries)</SelectItem>
                <SelectItem value="vrishabha">Vrishabha (Taurus)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chevvai Dosham */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>Chevvai Dosham</Label>
            <RadioGroup name="chevvai_dosham" defaultValue={profile.chevvai_dosham || ""}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dosham_yes" />
                  <Label htmlFor="dosham_yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dosham_no" />
                  <Label htmlFor="dosham_no" className="font-normal">
                    No
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dont_know" id="dosham_dont_know" />
                  <Label htmlFor="dosham_dont_know" className="font-normal">
                    Don't Know
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Eating Habits */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>Eating Habits</Label>
            <RadioGroup name="eating_habits" defaultValue={profile.eating_habits || "non_vegetarian"}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vegetarian" id="vegetarian" />
                  <Label htmlFor="vegetarian" className="font-normal">
                    Vegetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_vegetarian" id="non_vegetarian" />
                  <Label htmlFor="non_vegetarian" className="font-normal">
                    Non-vegetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eggetarian" id="eggetarian" />
                  <Label htmlFor="eggetarian" className="font-normal">
                    Eggetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vegan" id="vegan" />
                  <Label htmlFor="vegan" className="font-normal">
                    Vegan
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Smoking Habits */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>Smoking Habits</Label>
            <RadioGroup name="smoking_habits" defaultValue={profile.smoking_habits || "non_smoker"}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_smoker" id="non_smoker" />
                  <Label htmlFor="non_smoker" className="font-normal">
                    Non-smoker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light_smoker" id="light_smoker" />
                  <Label htmlFor="light_smoker" className="font-normal">
                    Light / Social smoker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular_smoker" id="regular_smoker" />
                  <Label htmlFor="regular_smoker" className="font-normal">
                    Regular smoker
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Drinking Habits */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label>Drinking Habits</Label>
            <RadioGroup name="drinking_habits" defaultValue={profile.drinking_habits || "non_drinker"}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_drinker" id="non_drinker" />
                  <Label htmlFor="non_drinker" className="font-normal">
                    Non-drinker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light_drinker" id="light_drinker" />
                  <Label htmlFor="light_drinker" className="font-normal">
                    Light / Social drinker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular_drinker" id="regular_drinker" />
                  <Label htmlFor="regular_drinker" className="font-normal">
                    Regular drinker
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* About Me */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <Label htmlFor="about_me">
              About Me <span className="text-red-500">*</span>
            </Label>
            <div className="w-full">
              <Textarea
                id="about_me"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="I'm a software professional with a Diploma currently working in private sector..."
                className="min-h-[120px] w-full"
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Min. 50 characters | {aboutMe.length} Characters typed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional sections placeholders */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Education & Occupation</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="education">Education</Label>
            <Input id="education" name="education" defaultValue={profile.education || ""} className="max-w-md" />
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" name="occupation" defaultValue={profile.occupation || ""} className="max-w-md" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Contact Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={profile.location || ""} className="max-w-md" />
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              defaultValue={profile.phone_number || ""}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={isSubmitting} className="bg-rose-500 hover:bg-rose-600 px-8">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
