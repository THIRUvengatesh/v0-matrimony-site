-- Interests table (tracks interest expressions between users)
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users_interest CHECK (sender_id != receiver_id),
  CONSTRAINT unique_interest UNIQUE (sender_id, receiver_id)
);

-- Shortlist table (users can shortlist profiles they're interested in)
CREATE TABLE IF NOT EXISTS shortlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users_shortlist CHECK (user_id != profile_id),
  CONSTRAINT unique_shortlist UNIQUE (user_id, profile_id)
);

-- Preferences table (user's matching preferences)
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  age_min INTEGER,
  age_max INTEGER,
  height_min INTEGER,
  height_max INTEGER,
  marital_status TEXT[],
  religion TEXT[],
  mother_tongue TEXT[],
  education TEXT[],
  occupation TEXT[],
  location TEXT[],
  eating_habits TEXT[],
  smoking_habits TEXT[],
  drinking_habits TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_interests_sender ON interests(sender_id);
CREATE INDEX IF NOT EXISTS idx_interests_receiver ON interests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);
CREATE INDEX IF NOT EXISTS idx_shortlist_user ON shortlist(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_profile ON shortlist(profile_id);
CREATE INDEX IF NOT EXISTS idx_preferences_user ON preferences(user_id);

-- Enable RLS
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for interests
CREATE POLICY "interests_select_own"
  ON interests FOR SELECT
  USING (auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text);

CREATE POLICY "interests_insert_own"
  ON interests FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id::text);

CREATE POLICY "interests_update_receiver"
  ON interests FOR UPDATE
  USING (auth.uid()::text = receiver_id::text);

-- RLS policies for shortlist
CREATE POLICY "shortlist_select_own"
  ON shortlist FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "shortlist_insert_own"
  ON shortlist FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "shortlist_delete_own"
  ON shortlist FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- RLS policies for preferences
CREATE POLICY "preferences_select_own"
  ON preferences FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "preferences_insert_own"
  ON preferences FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "preferences_update_own"
  ON preferences FOR UPDATE
  USING (auth.uid()::text = user_id::text);
