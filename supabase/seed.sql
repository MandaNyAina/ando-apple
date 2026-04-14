CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('iPhone','MacBook','iPad','Watch','AirPods','Accessories')),
  price numeric NOT NULL, original_price numeric,
  condition text NOT NULL CHECK (condition IN ('pristine','excellent','good')),
  description text, specs jsonb DEFAULT '{}', images text[] DEFAULT '{}',
  featured boolean DEFAULT false, in_stock boolean DEFAULT true,
  sort_order integer DEFAULT 0, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), section text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}', updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '', updated_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin insert site_content" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update site_content" ON site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin insert settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE TO authenticated USING (true);

INSERT INTO products (name, slug, category, price, original_price, condition, description, specs, featured, in_stock) VALUES
('iPhone 15 Pro 256Go', 'iphone-15-pro-256go', 'iPhone', 899, 1199, 'pristine', 'iPhone 15 Pro reconditionné par ASE Tech.', '{"Capacité":"256 Go","Couleur":"Titane naturel","Batterie":"98%","Écran":"Parfait"}', true, true),
('MacBook Pro M3 14"', 'macbook-pro-m3-14', 'MacBook', 1299, 1999, 'excellent', 'MacBook Pro M3 reconditionné.', '{"Processeur":"Apple M3","RAM":"18 Go","Stockage":"512 Go SSD","Écran":"14 pouces"}', false, true),
('iPad Air M1 64Go', 'ipad-air-m1-64go', 'iPad', 449, 699, 'good', 'iPad Air avec puce M1.', '{"Processeur":"Apple M1","Stockage":"64 Go","Écran":"10.9 pouces","Couleur":"Gris sidéral"}', false, true),
('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Watch', 599, 899, 'pristine', 'Apple Watch Ultra 2.', '{"Boîtier":"49mm Titane","Bracelet":"Boucle Alpine","GPS":"Oui","Cellular":"Oui"}', false, true);

INSERT INTO site_content (section, content) VALUES
('hero', '{"title":"La précision du reconditionné.","subtitle":"Chaque appareil passe par notre processus en 90 points. Batterie, écran, composants — certifié par nos techniciens, garanti 24 mois.","cta_primary":"Voir la collection","cta_secondary":"Notre processus","background_image":""}'),
('featured_product', '{"product_id":"","label":"Nouveau en stock","subtitle":"Titane naturel. Reconditionné grade A+."}'),
('values', '{"items":[{"title":"Inspection 90 points","description":"Chaque appareil est démonté, inspecté et testé méthodiquement.","icon":"ShieldCheck","image":""},{"title":"Économie circulaire","description":"Prolonger la vie des produits premium pour réduire l''impact environnemental.","icon":"Leaf","image":""},{"title":"Garantie 24 mois","description":"Chaque achat couvert pendant deux ans avec support technique réactif.","icon":"Certificate","image":""}]}'),
('testimonials', '{"items":[{"name":"Marie Lefebvre","role":"Designer freelance","rating":5,"comment":"Mon MacBook Pro est identique à un neuf."},{"name":"Thomas Ratsimbazafy","role":"Développeur","rating":5,"comment":"Troisième achat chez ASE Tech. Impeccable."},{"name":"Nadia Andrianarisoa","role":"Enseignante","rating":5,"comment":"iPad reconditionné parfait pour ma fille."},{"name":"Faly Rakotondrabe","role":"Entrepreneur","rating":5,"comment":"SAV réactif et professionnel."}]}'),
('cta', '{"title":"Votre prochain appareil vous attend.","subtitle":"Qualité certifiée. Prix accessible. Garanti 24 mois.","button_text":"Explorer la collection"}');

INSERT INTO settings (key, value) VALUES
('whatsapp_number', '+261340000000'), ('email', 'contact@asetech.mg'), ('phone', '+261340000000'),
('site_title', 'ASE TECH — Apple Reconditionné Premium'), ('site_description', 'Appareils Apple reconditionnés avec soin.');

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
