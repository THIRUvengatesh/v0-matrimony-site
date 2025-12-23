"use client"

import { PhotoUpload } from "@/components/photo-upload"
import { useRouter } from "next/navigation"

export function PhotoUploadClient({ photos }: { photos: string[] }) {
  const router = useRouter()

  const handlePhotosChange = () => {
    // Refresh the page to show updated photos
    router.refresh()
  }

  return <PhotoUpload photos={photos} onPhotosChange={handlePhotosChange} />
}
