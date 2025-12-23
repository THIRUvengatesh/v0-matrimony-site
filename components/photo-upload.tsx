"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
}

export function PhotoUpload({ photos, onPhotosChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      onPhotosChange([...photos, data.url])
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload photo")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return

    setDeleting(url)

    try {
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Delete failed")
      }

      onPhotosChange(photos.filter((p) => p !== url))
    } catch (error) {
      console.error("Delete error:", error)
      alert(error instanceof Error ? error.message : "Failed to delete photo")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={photo} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <Image src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(photo)}
              disabled={deleting === photo}
            >
              {deleting === photo ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded">
                Profile Photo
              </div>
            )}
          </div>
        ))}

        {photos.length < 10 && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-rose-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50">
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
            {uploading ? (
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {photos.length}/10 photos uploaded. First photo will be your profile picture.
      </p>
    </div>
  )
}
