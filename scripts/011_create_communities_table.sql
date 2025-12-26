-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert community data
INSERT INTO communities (name) VALUES
  ('Adi Dravida'),
  ('Agamudayar'),
  ('Ambattar'),
  ('Arunthathiyar'),
  ('Arya Vysya'),
  ('Badaga'),
  ('Boyar'),
  ('Brahmin - Iyer'),
  ('Brahmin - Iyengar'),
  ('Chettiar'),
  ('Chakkiliyar'),
  ('Devanga'),
  ('Dhobi'),
  ('Ezhava'),
  ('Gounder'),
  ('Idaiyar'),
  ('Irular'),
  ('Isai Vellalar'),
  ('Kallar'),
  ('Kammalar'),
  ('Kongu Vellalar'),
  ('Konar (Yadava)'),
  ('Kurumba'),
  ('Maravar'),
  ('Meenavar'),
  ('Mudaliar'),
  ('Mukkulathor'),
  ('Nadar'),
  ('Nagarathar'),
  ('Naidu'),
  ('Padayachi'),
  ('Pallar'),
  ('Panan'),
  ('Paraiyar'),
  ('Pattanavar'),
  ('Pillai'),
  ('Pulayar'),
  ('Rowther'),
  ('Sengunthar'),
  ('Saurashtra'),
  ('Thevar'),
  ('Toda'),
  ('Vannar'),
  ('Vanniyar'),
  ('Vettuva Gounder'),
  ('Vellala Gounder'),
  ('Viswakarma')
ON CONFLICT (name) DO NOTHING;

-- Add community_id to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS community_id INTEGER REFERENCES communities(id);

-- Enable RLS on communities table
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read communities
CREATE POLICY "Communities are viewable by everyone"
  ON communities FOR SELECT
  USING (true);
