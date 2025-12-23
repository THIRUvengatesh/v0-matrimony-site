-- Membership Plans table
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2) NOT NULL,
  discount_percentage INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_best_seller BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_transaction_id TEXT,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add membership status to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_membership ON profiles(membership_type);

-- Insert default membership plans
INSERT INTO membership_plans (name, display_name, description, duration_months, original_price, discounted_price, discount_percentage, features, is_best_seller, sort_order)
VALUES 
  (
    'gold',
    'Gold',
    'Basic premium membership',
    3,
    5500.00,
    3600.00,
    35,
    '[
      {"text": "Valid for 3 months", "enabled": true, "highlight": true},
      {"text": "View 40 Phone Nos", "enabled": true},
      {"text": "Send unlimited messages", "enabled": true},
      {"text": "Unlimited horoscope views", "enabled": true},
      {"text": "View verified profiles with photos", "enabled": false}
    ]'::jsonb,
    false,
    1
  ),
  (
    'prime_gold',
    'Prime Gold',
    'Enhanced premium membership',
    3,
    7900.00,
    4400.00,
    44,
    '[
      {"text": "Valid for 3 months", "enabled": true, "highlight": true},
      {"text": "View unlimited Phone Nos*", "enabled": true, "hasInfo": true},
      {"text": "Send unlimited messages", "enabled": true},
      {"text": "Unlimited horoscope views", "enabled": true},
      {"text": "View verified profiles with photos", "enabled": true}
    ]'::jsonb,
    false,
    2
  ),
  (
    'prime_till_u_marry',
    'Prime - Till U Marry',
    'Ultimate lifetime membership',
    12,
    23700.00,
    9900.00,
    58,
    '[
      {"text": "Longest validity plan", "enabled": true, "highlight": true, "hasInfo": true},
      {"text": "View unlimited Phone Nos*", "enabled": true, "hasInfo": true},
      {"text": "Send unlimited messages", "enabled": true},
      {"text": "Unlimited horoscope views", "enabled": true},
      {"text": "View verified profiles with photos", "enabled": true}
    ]'::jsonb,
    true,
    3
  )
ON CONFLICT DO NOTHING;

-- RLS policies for membership tables
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active membership plans
CREATE POLICY "membership_plans_select_active"
  ON membership_plans FOR SELECT
  USING (is_active = true);

-- Users can view their own subscriptions
CREATE POLICY "user_subscriptions_select_own"
  ON user_subscriptions FOR SELECT
  USING (true);

-- Only system can insert/update subscriptions (will be done via API)
CREATE POLICY "user_subscriptions_insert"
  ON user_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "user_subscriptions_update"
  ON user_subscriptions FOR UPDATE
  USING (true);
