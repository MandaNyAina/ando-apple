-- ============================================
-- ASE TECH — Full Database Seed
-- Run: npx supabase db reset (if using CLI)
-- Or paste in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('iPhone','MacBook','iPad','Watch','AirPods','Accessories')),
  price numeric NOT NULL,
  original_price numeric,
  condition text NOT NULL CHECK (condition IN ('pristine','excellent','good')),
  description text,
  specs jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  warranty_months integer,
  in_stock boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

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

-- ============================================
-- 2. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (true);

-- Site content
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admin insert site_content" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update site_content" ON site_content FOR UPDATE TO authenticated USING (true);

-- Settings
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin insert settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE TO authenticated USING (true);

-- Pages
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Admin insert pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update pages" ON pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete pages" ON pages FOR DELETE TO authenticated USING (true);

-- Categories
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete categories" ON categories FOR DELETE TO authenticated USING (true);

-- ============================================
-- 3. STORAGE POLICIES
-- ============================================

-- product-images bucket
CREATE POLICY "Public read product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin upload product-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin update product-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Admin delete product-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- site-assets bucket
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admin upload site-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "Admin update site-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "Admin delete site-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets');

-- ============================================
-- 4. SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, image, description, badge, visible_on_landing, sort_order) VALUES
('iPhone', 'iPhone', '', 'Du 12 au 15 Pro Max', 'Grade A+', true, 1),
('MacBook', 'MacBook', '', 'Air & Pro — M1 à M3', 'Excellent', true, 2),
('iPad', 'iPad', '', 'Toutes générations', '', true, 3),
('Watch', 'Watch', '', 'Series 7 à Ultra 2', '', true, 4),
('AirPods', 'AirPods', '', 'Pro, Max & standard', '', false, 5),
('Accessories', 'Accessories', '', 'Câbles, coques, chargeurs', '', false, 6)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, category, price, original_price, condition, description, specs, featured, in_stock) VALUES
('iPhone 15 Pro 256Go', 'iphone-15-pro-256go', 'iPhone', 899, 1199, 'pristine',
 'iPhone 15 Pro reconditionné par ASE Tech. Passé par notre inspection en 90 points. Batterie remplacée, écran vérifié, tous les capteurs testés.',
 '{"Capacité":"256 Go","Couleur":"Titane naturel","Batterie":"98%","Écran":"Parfait"}', true, true),
('iPhone 14 Pro 128Go', 'iphone-14-pro-128go', 'iPhone', 699, 999, 'excellent',
 'iPhone 14 Pro reconditionné. Dynamic Island, caméra 48MP, état excellent.',
 '{"Capacité":"128 Go","Couleur":"Noir sidéral","Batterie":"95%","Écran":"Parfait"}', true, true),
('MacBook Pro M3 14"', 'macbook-pro-m3-14', 'MacBook', 1299, 1999, 'excellent',
 'MacBook Pro M3 reconditionné. Performances exceptionnelles, écran Liquid Retina XDR vérifié.',
 '{"Processeur":"Apple M3","RAM":"18 Go","Stockage":"512 Go SSD","Écran":"14 pouces Liquid Retina XDR"}', true, true),
('MacBook Air M2 13"', 'macbook-air-m2-13', 'MacBook', 849, 1299, 'pristine',
 'MacBook Air M2, ultra-fin et silencieux. Parfait pour le quotidien.',
 '{"Processeur":"Apple M2","RAM":"8 Go","Stockage":"256 Go SSD","Écran":"13.6 pouces Liquid Retina"}', false, true),
('iPad Air M1 64Go', 'ipad-air-m1-64go', 'iPad', 449, 699, 'good',
 'iPad Air avec puce M1. Idéal pour la création et la productivité.',
 '{"Processeur":"Apple M1","Stockage":"64 Go","Écran":"10.9 pouces","Couleur":"Gris sidéral"}', false, true),
('iPad Pro M2 11"', 'ipad-pro-m2-11', 'iPad', 799, 1099, 'pristine',
 'iPad Pro M2, l''outil ultime pour les créatifs. ProMotion 120Hz.',
 '{"Processeur":"Apple M2","Stockage":"128 Go","Écran":"11 pouces Liquid Retina XDR","Face ID":"Oui"}', true, true),
('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Watch', 599, 899, 'pristine',
 'Apple Watch Ultra 2, le compagnon ultime pour les aventuriers.',
 '{"Boîtier":"49mm Titane","Bracelet":"Boucle Alpine","GPS":"Oui","Cellular":"Oui"}', false, true),
('Apple Watch Series 9', 'apple-watch-series-9', 'Watch', 349, 499, 'excellent',
 'Apple Watch Series 9, la montre connectée la plus populaire.',
 '{"Boîtier":"45mm Aluminium","Bracelet":"Sport","GPS":"Oui","Cellular":"Non"}', false, true),
('AirPods Pro 2', 'airpods-pro-2', 'AirPods', 189, 279, 'pristine',
 'AirPods Pro 2 avec boîtier USB-C. Réduction de bruit active.',
 '{"Type":"Intra-auriculaire","ANC":"Oui","Boîtier":"USB-C","Autonomie":"6h"}', false, true)
ON CONFLICT (slug) DO NOTHING;

-- Site content
INSERT INTO site_content (section, content) VALUES
('hero', '{"title":"La précision du reconditionné.","subtitle":"Chaque appareil passe par notre processus en 90 points. Batterie, écran, composants — certifié par nos techniciens, garanti 24 mois.","cta_primary":"Voir la collection","cta_secondary":"Notre processus","background_image":""}'),
('featured_product', '{"product_id":"","label":"Nouveau en stock","subtitle":"Titane naturel. Reconditionné grade A+."}'),
('values', '{"items":[{"title":"Inspection 90 points","description":"Chaque appareil est démonté, inspecté et testé méthodiquement. Batterie, écran, haut-parleurs, capteurs, connectique — rien n''est ignoré.","icon":"ShieldCheck","image":""},{"title":"Économie circulaire","description":"Chaque appareil reconditionné, c''est moins de matières premières extraites. Nous prolongeons la vie des produits premium.","icon":"Leaf","image":""},{"title":"Garantie 24 mois","description":"Nous assumons notre qualité. Chaque achat est couvert pendant deux ans avec support technique réactif.","icon":"Certificate","image":""}]}'),
('testimonials', '{"items":[{"name":"Marie Lefebvre","role":"Designer freelance","rating":5,"comment":"Mon MacBook Pro est identique à un neuf. Impossible de voir la différence."},{"name":"Thomas Ratsimbazafy","role":"Développeur","rating":5,"comment":"Troisième achat chez ASE Tech. L''iPhone 14 Pro est impeccable, batterie à 100%."},{"name":"Nadia Andrianarisoa","role":"Enseignante","rating":5,"comment":"J''ai offert un iPad reconditionné à ma fille. Elle n''a pas cru que ce n''était pas un neuf."},{"name":"Faly Rakotondrabe","role":"Entrepreneur","rating":5,"comment":"Service après-vente réactif et professionnel. Un souci mineur résolu en 48h."}]}'),
('cta', '{"title":"Votre prochain appareil vous attend.","subtitle":"Qualité certifiée. Prix accessible. Garanti 24 mois.","button_text":"Explorer la collection"}'),
('gallery', '{"items":[]}')
ON CONFLICT (section) DO NOTHING;

-- Settings
INSERT INTO settings (key, value) VALUES
('whatsapp_number', '+261340000000'),
('email', 'contact@asetech.mg'),
('phone', '+261340000000'),
('site_title', 'ASE TECH — Apple Reconditionné Premium'),
('site_description', 'Appareils Apple reconditionnés avec soin. Qualité premium, prix accessible.'),
('currency', 'Ar'),
('logo_url', '')
ON CONFLICT (key) DO NOTHING;
