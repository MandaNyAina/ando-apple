CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  cta_text text,
  cta_link text,
  published boolean DEFAULT true,
  show_in_footer boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Admin insert pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update pages" ON pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete pages" ON pages FOR DELETE TO authenticated USING (true);
