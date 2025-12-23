-- Add photos column to store array of photo URLs from Vercel Blob
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS profile_photo TEXT;

-- Update profile_photo to use first photo in array for existing profiles
UPDATE profiles 
SET profile_photo = photos[1]
WHERE photos IS NOT NULL AND array_length(photos, 1) > 0;
