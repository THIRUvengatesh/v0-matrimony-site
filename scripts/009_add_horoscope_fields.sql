-- Add horoscope generation and storage fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS horoscope_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS horoscope_content TEXT,
  ADD COLUMN IF NOT EXISTS horoscope_predictions JSONB;

-- Add index for faster horoscope lookups
CREATE INDEX IF NOT EXISTS idx_profiles_horoscope_generated ON profiles(user_id, horoscope_generated_at);
