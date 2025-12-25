-- Add missing profile fields for complete matrimony profile
ALTER TABLE profiles
  -- Education & Occupation
  ADD COLUMN IF NOT EXISTS highest_education TEXT,
  ADD COLUMN IF NOT EXISTS employed_in TEXT,
  ADD COLUMN IF NOT EXISTS annual_income TEXT,
  ADD COLUMN IF NOT EXISTS about_occupation TEXT,
  
  -- Family Details
  ADD COLUMN IF NOT EXISTS family_status TEXT CHECK (family_status IN ('middle_class', 'upper_middle_class', 'rich', 'affluent')),
  ADD COLUMN IF NOT EXISTS family_type TEXT CHECK (family_type IN ('joint', 'nuclear')),
  ADD COLUMN IF NOT EXISTS family_values TEXT CHECK (family_values IN ('traditional', 'moderate', 'liberal')),
  ADD COLUMN IF NOT EXISTS father_occupation TEXT,
  ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
  ADD COLUMN IF NOT EXISTS no_of_brothers INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS brothers_married INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS no_of_sisters INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sisters_married INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS about_family TEXT,
  
  -- Hobbies & Interest
  ADD COLUMN IF NOT EXISTS hobbies TEXT[],
  ADD COLUMN IF NOT EXISTS interests TEXT[],
  ADD COLUMN IF NOT EXISTS favorite_music TEXT[],
  ADD COLUMN IF NOT EXISTS sports TEXT[],
  ADD COLUMN IF NOT EXISTS favorite_reads TEXT,
  ADD COLUMN IF NOT EXISTS preferred_movies TEXT,
  
  -- Partner Preference
  ADD COLUMN IF NOT EXISTS partner_age_from INTEGER,
  ADD COLUMN IF NOT EXISTS partner_age_to INTEGER,
  ADD COLUMN IF NOT EXISTS partner_height_from INTEGER,
  ADD COLUMN IF NOT EXISTS partner_height_to INTEGER,
  ADD COLUMN IF NOT EXISTS partner_marital_status TEXT[],
  ADD COLUMN IF NOT EXISTS partner_religion TEXT[],
  ADD COLUMN IF NOT EXISTS partner_mother_tongue TEXT[],
  ADD COLUMN IF NOT EXISTS partner_education TEXT[],
  ADD COLUMN IF NOT EXISTS partner_occupation TEXT[],
  ADD COLUMN IF NOT EXISTS partner_country TEXT[],
  ADD COLUMN IF NOT EXISTS partner_state TEXT[],
  ADD COLUMN IF NOT EXISTS partner_eating_habits TEXT[],
  ADD COLUMN IF NOT EXISTS partner_smoking_habits TEXT[],
  ADD COLUMN IF NOT EXISTS partner_drinking_habits TEXT[],
  ADD COLUMN IF NOT EXISTS about_partner TEXT;
