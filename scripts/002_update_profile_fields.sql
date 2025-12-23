-- Add comprehensive profile fields for matrimony site
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_created_by TEXT,
  ADD COLUMN IF NOT EXISTS marital_status TEXT CHECK (marital_status IN ('unmarried', 'widow_widower', 'divorced', 'separated')),
  ADD COLUMN IF NOT EXISTS weight_kg INTEGER,
  ADD COLUMN IF NOT EXISTS physical_status TEXT CHECK (physical_status IN ('normal', 'physically_challenged')),
  ADD COLUMN IF NOT EXISTS subcaste TEXT,
  ADD COLUMN IF NOT EXISTS mother_tongue TEXT,
  ADD COLUMN IF NOT EXISTS languages_known TEXT[],
  ADD COLUMN IF NOT EXISTS gothra TEXT,
  ADD COLUMN IF NOT EXISTS star TEXT,
  ADD COLUMN IF NOT EXISTS rassi TEXT,
  ADD COLUMN IF NOT EXISTS chevvai_dosham TEXT,
  ADD COLUMN IF NOT EXISTS eating_habits TEXT CHECK (eating_habits IN ('vegetarian', 'non_vegetarian', 'eggetarian', 'vegan')),
  ADD COLUMN IF NOT EXISTS smoking_habits TEXT CHECK (smoking_habits IN ('non_smoker', 'light_smoker', 'regular_smoker')),
  ADD COLUMN IF NOT EXISTS drinking_habits TEXT CHECK (drinking_habits IN ('non_drinker', 'light_drinker', 'regular_drinker')),
  ADD COLUMN IF NOT EXISTS about_me TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS member_id TEXT UNIQUE;

-- Generate member IDs for existing profiles
UPDATE profiles 
SET member_id = 'VTU' || LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0')
WHERE member_id IS NULL;
