-- Add birth time and location details for horoscope generation
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS birth_time TEXT, -- Format: HH:MM
  ADD COLUMN IF NOT EXISTS birth_place TEXT,
  ADD COLUMN IF NOT EXISTS birth_latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS birth_longitude DECIMAL(11, 8);

-- Add comment
COMMENT ON COLUMN profiles.birth_time IS 'Birth time in HH:MM format for horoscope calculation';
COMMENT ON COLUMN profiles.birth_place IS 'Birth place name';
COMMENT ON COLUMN profiles.birth_latitude IS 'Birth place latitude for astronomical calculations';
COMMENT ON COLUMN profiles.birth_longitude IS 'Birth place longitude for astronomical calculations';
