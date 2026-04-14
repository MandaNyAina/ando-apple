CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text DEFAULT '',
  description text DEFAULT '',
  badge text DEFAULT '',
  visible_on_landing boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete categories" ON categories FOR DELETE TO authenticated USING (true);

-- Seed default categories
INSERT INTO categories (name, slug, image, description, badge, visible_on_landing, sort_order) VALUES
('iPhone', 'iPhone', '', 'Du 12 au 15 Pro Max', 'Grade A+', true, 1),
('MacBook', 'MacBook', '', 'Air & Pro — M1 à M3', 'Excellent', true, 2),
('iPad', 'iPad', '', 'Toutes générations', '', true, 3),
('Watch', 'Watch', '', 'Series 7 à Ultra 2', '', true, 4),
('AirPods', 'AirPods', '', 'Pro, Max & standard', '', false, 5),
('Accessories', 'Accessories', '', 'Câbles, coques, chargeurs', '', false, 6);
