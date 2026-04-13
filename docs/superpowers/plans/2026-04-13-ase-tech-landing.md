# ASE TECH Landing Page & Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium landing page for ASE TECH (refurbished Apple products) with an admin panel for managing products and content, using Next.js + Supabase.

**Architecture:** Next.js 14+ App Router with route groups `(public)` and `(admin)`. Server Components for data fetching with ISR. Supabase for PostgreSQL database, file storage, and auth. Framer Motion for animations. All landing page content and products are managed via an integrated admin panel at `/admin`.

**Tech Stack:** Next.js 14+, Tailwind CSS v4, Framer Motion, Supabase (DB + Storage + Auth), Outfit + Satoshi fonts, @phosphor-icons/react

---

## File Structure

```
ando-apple/
  app/
    layout.tsx                          Root layout — fonts, metadata, Tailwind
    page.tsx                            Landing page (SSG/ISR)
    globals.css                         Tailwind directives + CSS custom properties
    (public)/
      products/
        page.tsx                        Product catalog with filters
        [slug]/
          page.tsx                      Product detail page
    (admin)/
      admin/
        layout.tsx                      Admin layout + auth guard
        page.tsx                        Admin dashboard
        login/
          page.tsx                      Login page
        products/
          page.tsx                      Product list table
          new/
            page.tsx                    Add product form
          [id]/
            edit/
              page.tsx                  Edit product form
        content/
          page.tsx                      Landing page content editor
        settings/
          page.tsx                      Site settings (WhatsApp, email, SEO)
  components/
    ui/
      Button.tsx                        Solid + outline button with motion
      Badge.tsx                         Condition badges (pristine/excellent/good)
    landing/
      Nav.tsx                           Fixed glass nav (client component)
      Hero.tsx                          Asymmetric hero section
      Marquee.tsx                       Infinite text scroll strip
      FeaturedProduct.tsx               Full-width product spotlight
      GalleryStrip.tsx                  Infinite image carousel
      BentoGrid.tsx                     Category bento grid
      TrustValues.tsx                   Zig-zag values section
      Testimonials.tsx                  2-col offset testimonials
      CTASection.tsx                    Final CTA
      Footer.tsx                        Footer
      ScrollReveal.tsx                  Reusable scroll-triggered reveal wrapper
    product/
      ProductGallery.tsx                Image gallery + thumbnails (client)
      ProductInfo.tsx                   Price, specs, CTAs
      ProductCard.tsx                   Catalog grid card
      ProductFilters.tsx                Category/condition filters (client)
    admin/
      AdminSidebar.tsx                  Sidebar navigation
      ProductForm.tsx                   Product add/edit form (client)
      ProductTable.tsx                  Product list table
      ContentEditor.tsx                 Landing content forms (client)
      ImageUploader.tsx                 Drag & drop image upload (client)
      SpecsEditor.tsx                   Dynamic key-value spec fields (client)
  lib/
    supabase/
      client.ts                         Browser Supabase client
      server.ts                         Server Supabase client (RSC/Server Actions)
      middleware.ts                      Auth middleware for admin routes
    types.ts                            TypeScript types for DB schema
    utils.ts                            Slug generation, price formatting
    actions/
      products.ts                       Server Actions: CRUD products
      content.ts                        Server Actions: update site_content
      settings.ts                       Server Actions: update settings
      upload.ts                         Server Actions: image upload helper
  middleware.ts                          Next.js middleware for admin auth redirect
  supabase/
    seed.sql                            Seed data for development
  public/
    logo.jpg                            ASE TECH logo (copy from root)
```

---

## Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Move: `logo.jpg` → `public/logo.jpg`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/mandanyaina/Projects/ando-apple
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion @phosphor-icons/react
```

- [ ] **Step 3: Configure Tailwind with Steel Sage design system**

Replace the contents of `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-surface-0: #111614;
  --color-surface-1: #161b19;
  --color-surface-2: #1c2220;
  --color-surface-3: #232a28;
  --color-surface-4: #2d3533;

  /* Accent */
  --color-accent: #8a9e96;
  --color-accent-light: #a8bab2;
  --color-accent-muted: #697d75;

  /* Text */
  --color-text-primary: #e8ebe9;
  --color-text-secondary: #9aaba5;
  --color-text-muted: #5f706a;

  /* Admin (light) */
  --color-admin-bg: #f6f8f7;
  --color-admin-card: #ffffff;
  --color-admin-border: #e8ebe9;
  --color-admin-success: #4a8a6a;
  --color-admin-warning: #a06060;

  /* Typography */
  --font-headline: "Outfit", sans-serif;
  --font-body: "Satoshi", sans-serif;

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
}
```

- [ ] **Step 4: Configure root layout with fonts**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASE TECH — Apple Reconditionné Premium",
  description:
    "Appareils Apple reconditionnés avec soin. Qualité premium, prix accessible. Garantie 24 mois.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Create placeholder landing page**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-surface-0 text-text-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">
          ASE<span className="text-accent font-normal">TECH</span>
        </h1>
        <p className="mt-4 text-text-secondary">Coming soon</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Move logo and verify dev server**

```bash
cp /Users/mandanyaina/Projects/ando-apple/logo.jpg /Users/mandanyaina/Projects/ando-apple/public/logo.jpg
```

Run: `npm run dev`
Expected: Dev server starts at localhost:3000, dark page with "ASETECH" text in correct fonts/colors.

- [ ] **Step 7: Initialize git and commit**

```bash
cd /Users/mandanyaina/Projects/ando-apple
git init
echo "node_modules/\n.next/\n.env.local\n.superpowers/" > .gitignore
git add -A
git commit -m "feat: scaffold Next.js project with Steel Sage design system"
```

---

## Task 2: Supabase Setup & Types

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/types.ts`, `lib/utils.ts`
- Create: `supabase/seed.sql`
- Create: `.env.local` (not committed)

- [ ] **Step 1: Create .env.local with Supabase credentials**

Create `.env.local` (get values from Supabase dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 2: Create TypeScript types**

Create `lib/types.ts`:

```ts
export type ProductCondition = "pristine" | "excellent" | "good";

export type ProductCategory =
  | "iPhone"
  | "MacBook"
  | "iPad"
  | "Watch"
  | "AirPods"
  | "Accessories";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  original_price: number | null;
  condition: ProductCondition;
  description: string | null;
  specs: Record<string, string>;
  images: string[];
  featured: boolean;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  updated_at: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  background_image: string;
}

export interface FeaturedProductContent {
  product_id: string;
  label: string;
  subtitle: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface ValuesContent {
  items: ValueItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  rating: number;
  comment: string;
}

export interface TestimonialsContent {
  items: TestimonialItem[];
}

export interface CTAContent {
  title: string;
  subtitle: string;
  button_text: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
```

- [ ] **Step 3: Create Supabase browser client**

Create `lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 4: Create Supabase server client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

- [ ] **Step 5: Create utility functions**

Create `lib/utils.ts`:

```ts
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateSavings(
  price: number,
  originalPrice: number | null
): { amount: number; percentage: number } | null {
  if (!originalPrice || originalPrice <= price) return null;
  const amount = originalPrice - price;
  const percentage = Math.round((amount / originalPrice) * 100);
  return { amount, percentage };
}

export const CONDITION_LABELS: Record<string, string> = {
  pristine: "Grade A+ — Pristine",
  excellent: "Grade A — Excellent",
  good: "Grade B — Bon état",
};
```

- [ ] **Step 6: Create Supabase seed SQL**

Create `supabase/seed.sql`:

```sql
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('iPhone', 'MacBook', 'iPad', 'Watch', 'AirPods', 'Accessories')),
  price numeric NOT NULL,
  original_price numeric,
  condition text NOT NULL CHECK (condition IN ('pristine', 'excellent', 'good')),
  description text,
  specs jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert site_content" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update site_content" ON site_content FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin insert settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE TO authenticated USING (true);

-- Seed sample products
INSERT INTO products (name, slug, category, price, original_price, condition, description, specs, featured, in_stock) VALUES
('iPhone 15 Pro 256Go', 'iphone-15-pro-256go', 'iPhone', 899, 1199, 'pristine',
 'iPhone 15 Pro reconditionné par ASE Tech. Passé par notre inspection en 90 points. Batterie remplacée, écran vérifié, tous les capteurs testés.',
 '{"Capacité": "256 Go", "Couleur": "Titane naturel", "Batterie": "98%", "Écran": "Parfait"}',
 true, true),

('MacBook Pro M3 14"', 'macbook-pro-m3-14', 'MacBook', 1299, 1999, 'excellent',
 'MacBook Pro M3 reconditionné. Performances exceptionnelles, écran Liquid Retina XDR vérifié.',
 '{"Processeur": "Apple M3", "RAM": "18 Go", "Stockage": "512 Go SSD", "Écran": "14 pouces Liquid Retina XDR"}',
 false, true),

('iPad Air M1 64Go', 'ipad-air-m1-64go', 'iPad', 449, 699, 'good',
 'iPad Air avec puce M1. Idéal pour la création et la productivité.',
 '{"Processeur": "Apple M1", "Stockage": "64 Go", "Écran": "10.9 pouces", "Couleur": "Gris sidéral"}',
 false, true),

('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Watch', 599, 899, 'pristine',
 'Apple Watch Ultra 2, le compagnon ultime pour les aventuriers.',
 '{"Boîtier": "49mm Titane", "Bracelet": "Boucle Alpine", "GPS": "Oui", "Cellular": "Oui"}',
 false, true);

-- Seed site content
INSERT INTO site_content (section, content) VALUES
('hero', '{"title": "La précision du reconditionné.", "subtitle": "Chaque appareil passe par notre processus en 90 points. Batterie, écran, composants — certifié par nos techniciens, garanti 24 mois.", "cta_primary": "Voir la collection", "cta_secondary": "Notre processus", "background_image": ""}'),
('featured_product', '{"product_id": "", "label": "Nouveau en stock", "subtitle": "Titane naturel. Reconditionné grade A+."}'),
('values', '{"items": [{"title": "Inspection 90 points", "description": "Chaque appareil est démonté, inspecté et testé méthodiquement. Batterie, écran, haut-parleurs, capteurs, connectique — rien n''est ignoré.", "icon": "ShieldCheck", "image": ""}, {"title": "Économie circulaire", "description": "Chaque appareil reconditionné, c''est moins de matières premières extraites. Nous prolongeons la vie des produits premium.", "icon": "Leaf", "image": ""}, {"title": "Garantie 24 mois", "description": "Nous assumons notre qualité. Chaque achat est couvert pendant deux ans avec support technique réactif.", "icon": "Certificate", "image": ""}]}'),
('testimonials', '{"items": [{"name": "Marie Lefebvre", "role": "Designer freelance", "rating": 5, "comment": "Mon MacBook Pro est identique à un neuf. Impossible de voir la différence."}, {"name": "Thomas Ratsimbazafy", "role": "Développeur", "rating": 5, "comment": "Troisième achat chez ASE Tech. L''iPhone 14 Pro est impeccable, batterie à 100%."}, {"name": "Nadia Andrianarisoa", "role": "Enseignante", "rating": 5, "comment": "J''ai offert un iPad reconditionné à ma fille. Elle n''a pas cru que ce n''était pas un neuf."}, {"name": "Faly Rakotondrabe", "role": "Entrepreneur", "rating": 5, "comment": "Service après-vente réactif et professionnel. Un souci mineur résolu en 48h."}]}'),
('cta', '{"title": "Votre prochain appareil vous attend.", "subtitle": "Qualité certifiée. Prix accessible. Garanti 24 mois.", "button_text": "Explorer la collection"}');

-- Seed settings
INSERT INTO settings (key, value) VALUES
('whatsapp_number', '+261340000000'),
('email', 'contact@asetech.mg'),
('phone', '+261340000000'),
('site_title', 'ASE TECH — Apple Reconditionné Premium'),
('site_description', 'Appareils Apple reconditionnés avec soin. Qualité premium, prix accessible.');
```

- [ ] **Step 7: Run seed SQL in Supabase dashboard**

Go to Supabase Dashboard → SQL Editor → paste `supabase/seed.sql` → Run.
Also create Storage buckets: `product-images` and `site-assets` (both public).

- [ ] **Step 8: Commit**

```bash
git add lib/ supabase/ .gitignore
git commit -m "feat: add Supabase clients, types, utils, and seed SQL"
```

---

## Task 3: UI Components & Landing Nav

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Badge.tsx`
- Create: `components/landing/Nav.tsx`, `components/landing/Footer.tsx`
- Create: `components/landing/ScrollReveal.tsx`

- [ ] **Step 1: Create Button component**

Create `components/ui/Button.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  children: ReactNode;
}

export function Button({
  variant = "solid",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[12px] font-body font-semibold text-[13px] cursor-pointer transition-colors duration-200";
  const variants = {
    solid:
      "bg-accent text-surface-0 hover:bg-accent-light px-8 py-4",
    outline:
      "border border-[rgba(138,158,150,0.15)] text-text-primary hover:border-[rgba(138,158,150,0.3)] hover:bg-surface-2 px-8 py-4",
  };

  return (
    <motion.button
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 2: Create Badge component**

Create `components/ui/Badge.tsx`:

```tsx
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { CONDITION_LABELS } from "@/lib/utils";

interface BadgeProps {
  condition: string;
}

export function Badge({ condition }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent/10 border border-accent/[0.08] text-[11px] font-semibold text-accent-light">
      <ShieldCheck size={14} weight="fill" />
      {CONDITION_LABELS[condition] ?? condition}
    </span>
  );
}
```

- [ ] **Step 3: Create ScrollReveal wrapper**

Create `components/landing/ScrollReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create Nav component**

Create `components/landing/Nav.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, ShoppingBag } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/products", label: "Produits" },
  { href: "/products?category=iPhone", label: "iPhone" },
  { href: "/products?category=MacBook", label: "MacBook" },
  { href: "/products?category=iPad", label: "iPad" },
  { href: "/products?category=Watch", label: "Watch" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 w-full z-40 border-b border-[rgba(138,158,150,0.04)] transition-colors duration-300"
      style={{
        background: scrolled
          ? "rgba(17,22,20,0.85)"
          : "rgba(17,22,20,0.6)",
        backdropFilter: "blur(40px) saturate(1.4)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3.5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="ASE TECH"
            width={100}
            height={32}
            className="h-8 w-auto brightness-200"
          />
        </Link>

        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body font-medium text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-1">
          <button className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200">
            <MagnifyingGlass size={20} />
          </button>
          <button className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 5: Create Footer component**

Create `components/landing/Footer.tsx`:

```tsx
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "#", label: "Politique de confidentialité" },
  { href: "#", label: "CGV" },
  { href: "#", label: "Garantie" },
  { href: "#", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-surface-0 px-6 md:px-12 py-10 border-t border-[rgba(138,158,150,0.04)]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-headline font-bold text-text-muted text-sm tracking-wide">
          ASE TECH
        </span>
        <div className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-[11px] text-[rgba(138,158,150,0.3)]">
          {new Date().getFullYear()} ASE Tech
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Verify components render**

Update `app/page.tsx` temporarily to import and render Nav + Footer:

```tsx
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-surface-0 text-text-primary">
      <Nav />
      <div className="min-h-[100dvh] flex items-center justify-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">
          ASE<span className="text-accent font-normal">TECH</span>
        </h1>
      </div>
      <Footer />
    </main>
  );
}
```

Run: `npm run dev` — verify Nav is fixed at top with glass effect, Footer renders at bottom.

- [ ] **Step 7: Commit**

```bash
git add components/ app/
git commit -m "feat: add UI components (Button, Badge, ScrollReveal, Nav, Footer)"
```

---

## Task 4: Landing Page Sections (Hero → CTA)

**Files:**
- Create: `components/landing/Hero.tsx`, `components/landing/Marquee.tsx`
- Create: `components/landing/FeaturedProduct.tsx`, `components/landing/GalleryStrip.tsx`
- Create: `components/landing/BentoGrid.tsx`, `components/landing/TrustValues.tsx`
- Create: `components/landing/Testimonials.tsx`, `components/landing/CTASection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Hero section**

Create `components/landing/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { HeroContent, Product } from "@/lib/types";
import Link from "next/link";

interface HeroProps {
  content: HeroContent;
  featuredProduct: Product | null;
}

export function Hero({ content, featuredProduct }: HeroProps) {
  return (
    <section className="min-h-[100dvh] flex items-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left — Text */}
        <motion.div
          className="flex-[1.2] max-w-[600px]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-surface-2 border border-[rgba(138,158,150,0.08)] text-[11px] font-medium text-accent-light tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Apple reconditionné premium
          </div>

          <h1 className="font-headline font-extrabold text-5xl md:text-7xl leading-[0.92] tracking-[-3px] text-text-primary mb-6">
            {content.title.split(".")[0]}.
            <br />
            <span className="text-accent-light">
              {content.title.split(".")[1]?.trim() || ""}
            </span>
          </h1>

          <p className="text-base md:text-lg leading-relaxed text-text-secondary max-w-[440px] mb-10">
            {content.subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button variant="solid">{content.cta_primary}</Button>
            </Link>
            <Button variant="outline">{content.cta_secondary}</Button>
          </div>
        </motion.div>

        {/* Right — Showcase card */}
        {featuredProduct && (
          <motion.div
            className="flex-1 w-full max-w-[420px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              delay: 0.2,
            }}
          >
            <Link href={`/products/${featuredProduct.slug}`}>
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-[rgba(138,158,150,0.06)] bg-surface-1 backdrop-blur-xl">
                <div className="absolute -top-16 -right-16 w-52 h-52 bg-accent/15 rounded-full blur-[80px]" />

                {featuredProduct.images[0] && (
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface-0/95 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-headline font-bold text-xl text-white mb-1">
                    {featuredProduct.name}
                  </h3>
                  <div className="flex gap-3 text-[9px] uppercase tracking-widest text-text-muted mb-3">
                    <span>{CONDITION_LABELS[featuredProduct.condition]?.split(" — ")[1] ?? featuredProduct.condition}</span>
                    <span className="text-accent">●</span>
                    <span>Garantie 24 mois</span>
                  </div>
                  <div>
                    <span className="font-headline font-bold text-lg text-accent-light">
                      {formatPrice(featuredProduct.price)} EUR
                    </span>
                    {featuredProduct.original_price && (
                      <span className="text-sm text-text-muted line-through ml-2">
                        {formatPrice(featuredProduct.original_price)} EUR
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

import { CONDITION_LABELS } from "@/lib/utils";
```

- [ ] **Step 2: Create Marquee strip**

Create `components/landing/Marquee.tsx`:

```tsx
const ITEMS = [
  "Garantie 24 mois",
  "Inspection 90 points",
  "Livraison express",
  "Satisfait ou remboursé",
  "Batterie certifiée",
  "Économie circulaire",
  "Support technique dédié",
  "Paiement sécurisé",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="py-5 bg-surface-1 border-y border-[rgba(138,158,150,0.04)] overflow-hidden">
      <div
        className="flex gap-12 animate-marquee"
        style={{ width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[13px] font-medium text-text-muted uppercase tracking-widest whitespace-nowrap font-headline"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-accent opacity-40" />
          </span>
        ))}
      </div>
    </section>
  );
}
```

Add to `app/globals.css` after the `@theme` block:

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}
```

- [ ] **Step 3: Create FeaturedProduct section**

Create `components/landing/FeaturedProduct.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "./ScrollReveal";
import { formatPrice } from "@/lib/utils";
import type { FeaturedProductContent, Product } from "@/lib/types";
import Link from "next/link";

interface FeaturedProductProps {
  content: FeaturedProductContent;
  product: Product | null;
}

export function FeaturedProduct({ content, product }: FeaturedProductProps) {
  if (!product) return null;

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 text-center bg-surface-0 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
      </div>

      <ScrollReveal>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent mb-3 block">
          {content.label}
        </span>
        <h2 className="font-headline text-4xl md:text-[52px] font-extrabold text-text-primary tracking-[-2px] mb-2">
          {product.name}
        </h2>
        <p className="text-text-secondary text-lg mb-12">{content.subtitle}</p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        {product.images[0] && (
          <div className="max-w-[640px] mx-auto rounded-[20px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="mt-8 flex gap-3 justify-center items-baseline">
          <span className="font-headline text-[22px] font-bold text-accent-light">
            À partir de {formatPrice(product.price)} EUR
          </span>
          {product.original_price && (
            <span className="text-base text-text-muted line-through">
              {formatPrice(product.original_price)} EUR
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <Link href={`/products/${product.slug}`}>
            <Button variant="solid">Découvrir</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Comparer les modèles</Button>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 4: Create GalleryStrip**

Create `components/landing/GalleryStrip.tsx`:

```tsx
interface GalleryStripProps {
  images: string[];
}

export function GalleryStrip({ images }: GalleryStripProps) {
  if (images.length === 0) return null;
  const doubled = [...images, ...images];

  return (
    <section className="py-16 bg-surface-0 overflow-hidden">
      <div
        className="flex gap-4 animate-gallery"
        style={{ width: "max-content" }}
      >
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-[280px] rounded-[16px] object-cover flex-shrink-0 brightness-[0.85] contrast-[1.05] hover:brightness-100 hover:contrast-100 transition-[filter] duration-300"
          />
        ))}
      </div>
    </section>
  );
}
```

Add to `app/globals.css`:

```css
@keyframes gallery {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-gallery {
  animation: gallery 35s linear infinite;
}
```

- [ ] **Step 5: Create BentoGrid**

Create `components/landing/BentoGrid.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";

interface BentoCategory {
  name: string;
  slug: string;
  image: string;
  badge?: string;
  subtitle: string;
}

interface BentoGridProps {
  categories: BentoCategory[];
}

function BentoCard({
  cat,
  className = "",
}: {
  cat: BentoCategory;
  className?: string;
}) {
  return (
    <Link href={`/products?category=${cat.slug}`}>
      <motion.div
        className={`relative rounded-[20px] overflow-hidden border border-[rgba(138,158,150,0.04)] cursor-pointer group ${className}`}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-0/85 via-surface-0/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7">
          {cat.badge && (
            <span className="inline-block px-2.5 py-1 rounded-[6px] bg-accent/[0.12] text-accent-light border border-accent/[0.08] text-[9px] font-semibold uppercase tracking-wide mb-2">
              {cat.badge}
            </span>
          )}
          <h3 className="font-headline font-bold text-white text-lg">
            {cat.name}
          </h3>
          <p className="text-xs text-text-muted mt-1">{cat.subtitle}</p>
        </div>
      </motion.div>
    </Link>
  );
}

const DEFAULT_CATEGORIES: BentoCategory[] = [
  { name: "iPhone", slug: "iPhone", image: "https://picsum.photos/seed/bento-iphone/600/700", badge: "Grade A+", subtitle: "Du 12 au 15 Pro Max" },
  { name: "MacBook", slug: "MacBook", image: "https://picsum.photos/seed/bento-mac/500/300", badge: "Excellent", subtitle: "Air & Pro — M1 à M3" },
  { name: "iPad", slug: "iPad", image: "https://picsum.photos/seed/bento-ipad/400/300", subtitle: "Toutes générations" },
  { name: "Watch", slug: "Watch", image: "https://picsum.photos/seed/bento-watch/400/300", subtitle: "Series 7 à Ultra 2" },
];

export function BentoGrid({ categories }: BentoGridProps) {
  const cats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [big, wide, small1, small2] = cats;

  return (
    <section className="py-24 px-6 md:px-12 bg-surface-1">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-[40px] font-extrabold text-text-primary tracking-[-2px] mb-2">
            La collection.
          </h2>
          <p className="text-text-muted text-sm mb-12">
            Sélection rigoureuse de produits Apple reconditionnés premium.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[300px_300px] gap-3">
          {big && (
            <ScrollReveal className="md:row-span-2" delay={0}>
              <BentoCard cat={big} className="h-full" />
            </ScrollReveal>
          )}
          {wide && (
            <ScrollReveal className="md:col-span-2" delay={0.1}>
              <BentoCard cat={wide} className="h-full" />
            </ScrollReveal>
          )}
          {small1 && (
            <ScrollReveal delay={0.2}>
              <BentoCard cat={small1} className="h-full min-h-[200px]" />
            </ScrollReveal>
          )}
          {small2 && (
            <ScrollReveal delay={0.3}>
              <BentoCard cat={small2} className="h-full min-h-[200px]" />
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create TrustValues (zig-zag layout)**

Create `components/landing/TrustValues.tsx`:

```tsx
"use client";

import { ScrollReveal } from "./ScrollReveal";
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";
import type { ValuesContent, ValueItem } from "@/lib/types";

interface TrustValuesProps {
  content: ValuesContent;
}

function ValueIcon({ name }: { name: string }) {
  const Icon = (PhosphorIcons as any)[name];
  if (!Icon) return null;
  return <Icon size={28} weight="regular" />;
}

export function TrustValues({ content }: TrustValuesProps) {
  return (
    <section className="py-28 px-6 md:px-12 bg-surface-0">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent block mb-3">
            Le standard ASE Tech
          </span>
          <h2 className="font-headline text-3xl md:text-[40px] font-extrabold text-text-primary tracking-[-2px] mb-20">
            Construit pour durer.
          </h2>
        </ScrollReveal>

        {content.items.map((item, i) => (
          <ScrollReveal key={i}>
            <div
              className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start mb-20 pb-20 border-b border-[rgba(138,158,150,0.06)] last:border-0 last:mb-0 last:pb-0 ${
                i % 2 === 1 ? "md:direction-rtl" : ""
              }`}
              style={i % 2 === 1 ? { direction: "rtl" } : undefined}
            >
              <div style={{ direction: "ltr" }}>
                <span className="font-headline font-extralight text-6xl text-surface-4 tracking-[-3px] block mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-headline font-bold text-xl text-text-primary mb-3">
                  {item.title}
                </h4>
                <p className="text-text-secondary text-[15px] leading-relaxed max-w-[65ch]">
                  {item.description}
                </p>
              </div>
              <div
                className="bg-surface-1 rounded-[20px] border border-[rgba(138,158,150,0.04)] aspect-video overflow-hidden"
                style={{ direction: "ltr" }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent">
                    <ValueIcon name={item.icon} />
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create Testimonials (2-col offset)**

Create `components/landing/Testimonials.tsx`:

```tsx
"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Star } from "@phosphor-icons/react/dist/ssr";
import type { TestimonialsContent } from "@/lib/types";

interface TestimonialsProps {
  content: TestimonialsContent;
}

export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface-1">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-[40px] font-extrabold text-text-primary tracking-[-2px] mb-12">
            Retours clients.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.items.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.1}
              className={i % 2 === 1 ? "md:mt-10" : ""}
            >
              <div className="bg-surface-2 rounded-[20px] p-8 border border-[rgba(138,158,150,0.04)] hover:border-[rgba(138,158,150,0.12)] transition-colors duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      weight="fill"
                      className="text-accent"
                    />
                  ))}
                </div>
                <blockquote className="text-text-secondary text-[15px] leading-relaxed mb-6">
                  &ldquo;{item.comment}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-surface-3 flex items-center justify-center text-text-muted text-xs font-bold">
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Create CTASection**

Create `components/landing/CTASection.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "./ScrollReveal";
import type { CTAContent } from "@/lib/types";
import Link from "next/link";

interface CTASectionProps {
  content: CTAContent;
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="py-36 md:py-44 px-6 md:px-12 text-center relative overflow-hidden bg-surface-0">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-accent/[0.06] rounded-full blur-[150px]" />
      </div>
      <ScrollReveal>
        <h2 className="font-headline text-4xl md:text-[56px] font-extrabold text-text-primary tracking-[-3px] mb-4 relative z-10">
          {content.title}
        </h2>
        <p className="text-text-secondary text-base mb-10 relative z-10">
          {content.subtitle}
        </p>
        <Link href="/products" className="relative z-10">
          <Button variant="solid">{content.button_text}</Button>
        </Link>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 9: Assemble landing page with Supabase data**

Replace `app/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { FeaturedProduct } from "@/components/landing/FeaturedProduct";
import { GalleryStrip } from "@/components/landing/GalleryStrip";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { TrustValues } from "@/components/landing/TrustValues";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
  Product,
} from "@/lib/types";

export const revalidate = 60;

async function getSiteContent(section: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("section", section)
    .single();
  return data?.content ?? null;
}

async function getFeaturedProduct(): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export default async function Home() {
  const [hero, featuredContent, values, testimonials, cta, featuredProduct] =
    await Promise.all([
      getSiteContent("hero") as Promise<HeroContent | null>,
      getSiteContent("featured_product") as Promise<FeaturedProductContent | null>,
      getSiteContent("values") as Promise<ValuesContent | null>,
      getSiteContent("testimonials") as Promise<TestimonialsContent | null>,
      getSiteContent("cta") as Promise<CTAContent | null>,
      getFeaturedProduct(),
    ]);

  const defaultHero: HeroContent = {
    title: "La précision du reconditionné.",
    subtitle: "Chaque appareil passe par notre processus en 90 points.",
    cta_primary: "Voir la collection",
    cta_secondary: "Notre processus",
    background_image: "",
  };

  const defaultCTA: CTAContent = {
    title: "Votre prochain appareil vous attend.",
    subtitle: "Qualité certifiée. Prix accessible. Garanti 24 mois.",
    button_text: "Explorer la collection",
  };

  return (
    <main className="bg-surface-0 text-text-primary">
      <Nav />
      <Hero content={hero ?? defaultHero} featuredProduct={featuredProduct} />
      <Marquee />
      {featuredContent && featuredProduct && (
        <FeaturedProduct content={featuredContent} product={featuredProduct} />
      )}
      <GalleryStrip images={[]} />
      <BentoGrid categories={[]} />
      {values && <TrustValues content={values} />}
      {testimonials && <Testimonials content={testimonials} />}
      <CTASection content={cta ?? defaultCTA} />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 10: Verify landing page**

Run: `npm run dev` — verify all sections render with seed data. Check scroll animations fire on scroll down. Check Nav glass effect. Check Marquee scrolls infinitely.

- [ ] **Step 11: Commit**

```bash
git add components/landing/ app/page.tsx app/globals.css
git commit -m "feat: implement all landing page sections with Supabase data"
```

---

## Task 5: Product Catalog & Detail Pages

**Files:**
- Create: `app/(public)/products/page.tsx`, `app/(public)/products/[slug]/page.tsx`
- Create: `components/product/ProductCard.tsx`, `components/product/ProductFilters.tsx`
- Create: `components/product/ProductGallery.tsx`, `components/product/ProductInfo.tsx`

- [ ] **Step 1: Create ProductCard**

Create `components/product/ProductCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group rounded-[20px] overflow-hidden border border-[rgba(138,158,150,0.04)] bg-surface-1 hover:border-[rgba(138,158,150,0.12)] transition-colors"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="aspect-[4/3] overflow-hidden bg-surface-2">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
              Pas d'image
            </div>
          )}
        </div>
        <div className="p-5">
          <span className="text-[10px] uppercase tracking-widest text-text-muted">
            {product.category}
          </span>
          <h3 className="font-headline font-bold text-base text-text-primary mt-1 mb-2">
            {product.name}
          </h3>
          <Badge condition={product.condition} />
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-lg text-accent-light">
              {formatPrice(product.price)} EUR
            </span>
            {product.original_price && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.original_price)} EUR
              </span>
            )}
          </div>
          {!product.in_stock && (
            <span className="inline-block mt-2 text-[10px] text-admin-warning font-medium uppercase tracking-wider">
              Rupture de stock
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 2: Create ProductFilters**

Create `components/product/ProductFilters.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["Tous", "iPhone", "MacBook", "iPad", "Watch", "AirPods", "Accessories"];
const CONDITIONS = ["Tous", "pristine", "excellent", "good"];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "Tous";
  const currentCondition = searchParams.get("condition") ?? "Tous";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "Tous") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => updateFilter("category", cat)}
          className={`px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200 ${
            currentCategory === cat
              ? "bg-accent text-surface-0"
              : "bg-surface-2 text-text-muted hover:text-text-primary border border-[rgba(138,158,150,0.06)]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create product catalog page**

Create `app/(public)/products/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { Product } from "@/lib/types";
import { Suspense } from "react";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ category?: string; condition?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "Tous") {
    query = query.eq("category", params.category);
  }
  if (params.condition && params.condition !== "Tous") {
    query = query.eq("condition", params.condition);
  }

  const { data: products } = await query;

  return (
    <main className="bg-surface-0 text-text-primary min-h-[100dvh]">
      <Nav />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-20">
        <h1 className="font-headline text-3xl md:text-[40px] font-extrabold tracking-[-2px] mb-2">
          Nos produits.
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {(products ?? []).length} produit{(products ?? []).length !== 1 ? "s" : ""} disponible{(products ?? []).length !== 1 ? "s" : ""}
        </p>

        <Suspense>
          <ProductFilters />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products ?? []).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {(products ?? []).length === 0 && (
          <div className="text-center py-20 text-text-muted">
            Aucun produit trouvé pour ces filtres.
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Create ProductGallery**

Create `components/product/ProductGallery.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-[20px] bg-surface-1 border border-[rgba(138,158,150,0.04)] flex items-center justify-center text-text-muted">
        Pas d'image
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[4/3] rounded-[20px] overflow-hidden bg-surface-1 border border-[rgba(138,158,150,0.04)] relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={images[selected]}
            alt={`${name} — vue ${selected + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-[72px] h-[72px] rounded-[12px] overflow-hidden border-2 transition-colors duration-200 ${
                i === selected
                  ? "border-accent"
                  : "border-transparent hover:border-surface-4"
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create ProductInfo**

Create `components/product/ProductInfo.tsx`:

```tsx
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, calculateSavings } from "@/lib/utils";
import { ShieldCheck, ChatCircle } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@/lib/types";
import Link from "next/link";

interface ProductInfoProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductInfo({ product, whatsappNumber }: ProductInfoProps) {
  const savings = calculateSavings(product.price, product.original_price);
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé par : ${product.name}`)}`;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="text-xs text-text-muted mb-4">
        <Link href="/products" className="text-accent hover:underline">
          Produits
        </Link>
        {" / "}
        <Link
          href={`/products?category=${product.category}`}
          className="text-accent hover:underline"
        >
          {product.category}
        </Link>
        {" / "}
        <span>{product.name}</span>
      </div>

      <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-[-1.5px] text-text-primary mb-3">
        {product.name}
      </h1>

      <div className="mb-5">
        <Badge condition={product.condition} />
      </div>

      <div className="mb-7">
        <span className="font-headline text-3xl font-bold text-accent-light">
          {formatPrice(product.price)} EUR
        </span>
        {product.original_price && (
          <span className="text-lg text-text-muted line-through ml-3">
            {formatPrice(product.original_price)} EUR
          </span>
        )}
        {savings && (
          <div className="text-xs text-admin-success mt-1">
            Économie de {formatPrice(savings.amount)} EUR ({savings.percentage}%)
          </div>
        )}
      </div>

      {/* Specs */}
      {Object.keys(product.specs).length > 0 && (
        <div className="mb-7">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-3 border-b border-[rgba(138,158,150,0.06)] text-sm"
            >
              <span className="text-text-muted">{key}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}

      {product.description && (
        <p className="text-sm leading-relaxed text-text-secondary mb-7 max-w-[65ch]">
          {product.description}
        </p>
      )}

      <div className="space-y-3 mb-5">
        <Button variant="solid" className="w-full">
          Nous contacter pour ce produit
        </Button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <ChatCircle size={18} />
            Discuter sur WhatsApp
          </Button>
        </a>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-[12px] bg-surface-2 border border-[rgba(138,158,150,0.04)] text-sm text-text-secondary">
        <ShieldCheck size={20} className="text-accent flex-shrink-0" />
        <span>Garanti 24 mois par ASE Tech. Support technique inclus.</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create product detail page**

Create `app/(public)/products/[slug]/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} — ASE TECH`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const { data: settings } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "whatsapp_number")
    .single();

  const whatsappNumber = settings?.value ?? "";

  return (
    <main className="bg-surface-0 text-text-primary min-h-[100dvh]">
      <Nav />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-start">
          <ProductGallery images={product.images ?? []} name={product.name} />
          <ProductInfo product={product} whatsappNumber={whatsappNumber} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 7: Verify product pages**

Run: `npm run dev`
- Navigate to `/products` — verify catalog renders with filter pills and product cards
- Click a product — verify detail page shows gallery, specs table, price, CTAs
- Verify WhatsApp link opens correctly

- [ ] **Step 8: Commit**

```bash
git add app/(public)/ components/product/
git commit -m "feat: implement product catalog and detail pages"
```

---

## Task 6: Admin Auth & Layout

**Files:**
- Create: `middleware.ts` (root)
- Create: `app/(admin)/admin/layout.tsx`, `app/(admin)/admin/login/page.tsx`
- Create: `app/(admin)/admin/page.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create Next.js middleware for admin auth**

Create `middleware.ts` at project root:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Create AdminSidebar**

Create `components/admin/AdminSidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Devices,
  PencilLine,
  Image as ImageIcon,
  GearSix,
  SignOut,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", icon: SquaresFour, label: "Dashboard" },
  { href: "/admin/products", icon: Devices, label: "Produits" },
  { href: "/admin/content", icon: PencilLine, label: "Contenu Landing" },
  { href: "/admin/settings", icon: GearSix, label: "Paramètres" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-60 bg-white border-r border-admin-border min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-admin-border">
        <span className="font-headline font-extrabold text-base text-surface-0 tracking-tight">
          ASE<span className="text-accent font-normal">TECH</span>
        </span>
        <span className="text-text-muted text-xs ml-1">Admin</span>
      </div>

      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium border-l-2 transition-all duration-200 ${
                isActive
                  ? "text-surface-0 bg-accent/[0.06] border-l-accent font-semibold"
                  : "text-text-muted border-l-transparent hover:text-surface-0 hover:bg-admin-bg"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-admin-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-text-muted text-[13px] hover:text-admin-warning transition-colors w-full"
        >
          <SignOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create admin layout**

Create `app/(admin)/admin/layout.tsx`:

```tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-admin-bg font-body">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Create admin login page**

Create `app/(admin)/admin/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-headline font-extrabold text-2xl text-surface-0 tracking-tight">
            ASE<span className="text-accent font-normal">TECH</span>
          </h1>
          <p className="text-text-muted text-sm mt-2">
            Connexion administration
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[14px] border border-admin-border p-7 space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3.5 py-2.5 rounded-[10px] border border-admin-border bg-admin-bg font-body text-sm focus:border-accent outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-3.5 py-2.5 rounded-[10px] border border-admin-border bg-admin-bg font-body text-sm focus:border-accent outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-admin-warning text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[10px] bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create admin dashboard**

Create `app/(admin)/admin/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: inStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("in_stock", true);

  return (
    <div>
      <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-[14px] border border-admin-border p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
            Total produits
          </div>
          <div className="font-headline text-3xl font-bold text-surface-0">
            {productCount ?? 0}
          </div>
        </div>
        <div className="bg-white rounded-[14px] border border-admin-border p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
            En stock
          </div>
          <div className="font-headline text-3xl font-bold text-admin-success">
            {inStockCount ?? 0}
          </div>
        </div>
        <div className="bg-white rounded-[14px] border border-admin-border p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
            Rupture
          </div>
          <div className="font-headline text-3xl font-bold text-admin-warning">
            {(productCount ?? 0) - (inStockCount ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create admin user in Supabase**

Go to Supabase Dashboard → Authentication → Users → Add user.
Email: your admin email. Password: your admin password.

- [ ] **Step 7: Verify admin auth flow**

Run: `npm run dev`
- Navigate to `/admin` → should redirect to `/admin/login`
- Login with admin credentials → should redirect to `/admin` dashboard
- Verify sidebar navigation works
- Verify logout redirects to login

- [ ] **Step 8: Commit**

```bash
git add middleware.ts app/(admin)/ components/admin/
git commit -m "feat: implement admin auth, layout, sidebar, and dashboard"
```

---

## Task 7: Admin Product CRUD

**Files:**
- Create: `lib/actions/products.ts`
- Create: `components/admin/ProductTable.tsx`, `components/admin/ProductForm.tsx`
- Create: `components/admin/ImageUploader.tsx`, `components/admin/SpecsEditor.tsx`
- Create: `app/(admin)/admin/products/page.tsx`
- Create: `app/(admin)/admin/products/new/page.tsx`
- Create: `app/(admin)/admin/products/[id]/edit/page.tsx`

- [ ] **Step 1: Create product server actions**

Create `lib/actions/products.ts`:

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const product = {
    name,
    slug: generateSlug(name),
    category: formData.get("category") as string,
    price: parseFloat(formData.get("price") as string),
    original_price: formData.get("original_price")
      ? parseFloat(formData.get("original_price") as string)
      : null,
    condition: formData.get("condition") as string,
    description: formData.get("description") as string,
    specs: JSON.parse((formData.get("specs") as string) || "{}"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
    in_stock: formData.get("in_stock") !== "false",
  };

  const { error } = await supabase.from("products").insert(product);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const product = {
    name,
    slug: generateSlug(name),
    category: formData.get("category") as string,
    price: parseFloat(formData.get("price") as string),
    original_price: formData.get("original_price")
      ? parseFloat(formData.get("original_price") as string)
      : null,
    condition: formData.get("condition") as string,
    description: formData.get("description") as string,
    specs: JSON.parse((formData.get("specs") as string) || "{}"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
    in_stock: formData.get("in_stock") !== "false",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("products").update(product).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}
```

- [ ] **Step 2: Create ImageUploader**

Create `components/admin/ImageUploader.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadSimple, X } from "@phosphor-icons/react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket?: string;
}

export function ImageUploader({
  images,
  onChange,
  bucket = "product-images",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const supabase = createClient();
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file);

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(path);
          newUrls.push(publicUrl);
        }
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
      e.target.value = "";
    },
    [images, onChange, bucket]
  );

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block border-2 border-dashed border-admin-border rounded-[14px] p-10 text-center cursor-pointer hover:border-accent transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <UploadSimple size={32} className="mx-auto text-text-muted mb-2" />
        <p className="text-[13px] text-text-muted">
          {uploading ? "Upload en cours..." : "Glisser-déposer ou cliquer pour ajouter"}
        </p>
        <p className="text-[11px] text-text-muted/50 mt-1">
          JPG, PNG, WebP — max 5Mo
        </p>
      </label>

      {images.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-[10px] overflow-hidden bg-admin-border"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X size={10} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create SpecsEditor**

Create `components/admin/SpecsEditor.tsx`:

```tsx
"use client";

import { Plus, Trash } from "@phosphor-icons/react";

interface SpecsEditorProps {
  specs: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
}

export function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
  const entries = Object.entries(specs);

  function addSpec() {
    onChange({ ...specs, "": "" });
  }

  function updateKey(oldKey: string, newKey: string, index: number) {
    const newSpecs: Record<string, string> = {};
    entries.forEach(([k, v], i) => {
      newSpecs[i === index ? newKey : k] = v;
    });
    onChange(newSpecs);
  }

  function updateValue(key: string, value: string) {
    onChange({ ...specs, [key]: value });
  }

  function removeSpec(key: string) {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    onChange(newSpecs);
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value], i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="Clé (ex: Capacité)"
            value={key}
            onChange={(e) => updateKey(key, e.target.value, i)}
            className="flex-1 px-3 py-2 rounded-[10px] border border-admin-border bg-admin-bg text-sm focus:border-accent outline-none"
          />
          <input
            type="text"
            placeholder="Valeur (ex: 256 Go)"
            value={value}
            onChange={(e) => updateValue(key, e.target.value)}
            className="flex-1 px-3 py-2 rounded-[10px] border border-admin-border bg-admin-bg text-sm focus:border-accent outline-none"
          />
          <button
            type="button"
            onClick={() => removeSpec(key)}
            className="p-2 text-text-muted hover:text-admin-warning transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSpec}
        className="flex items-center gap-1.5 text-accent text-[13px] font-medium hover:text-accent-light transition-colors"
      >
        <Plus size={14} /> Ajouter un champ
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create ProductForm**

Create `components/admin/ProductForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { SpecsEditor } from "./SpecsEditor";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
}

const CATEGORIES = ["iPhone", "MacBook", "iPad", "Watch", "AirPods", "Accessories"];
const CONDITIONS = [
  { value: "pristine", label: "Pristine (A+)" },
  { value: "excellent", label: "Excellent (A)" },
  { value: "good", label: "Bon état (B)" },
];

export function ProductForm({ product, action }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [specs, setSpecs] = useState<Record<string, string>>(product?.specs ?? {});

  async function handleSubmit(formData: FormData) {
    formData.set("images", JSON.stringify(images));
    formData.set("specs", JSON.stringify(specs));
    await action(formData);
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-[10px] border border-admin-border bg-admin-bg font-body text-sm focus:border-accent outline-none transition-colors";
  const labelClass =
    "text-[12px] font-semibold text-text-muted uppercase tracking-wide";

  return (
    <form action={handleSubmit} className="space-y-4 max-w-3xl">
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5 tracking-tight">
          Informations produit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nom du produit</label>
            <input name="name" required defaultValue={product?.name} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Catégorie</label>
            <select name="category" defaultValue={product?.category} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Prix (EUR)</label>
            <input name="price" type="number" required defaultValue={product?.price} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Prix original (EUR)</label>
            <input name="original_price" type="number" defaultValue={product?.original_price ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>État / Grade</label>
            <select name="condition" defaultValue={product?.condition ?? "excellent"} className={inputClass}>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>En stock</label>
            <select name="in_stock" defaultValue={product?.in_stock !== false ? "true" : "false"} className={inputClass}>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Produit vedette</label>
            <select name="featured" defaultValue={product?.featured ? "true" : "false"} className={inputClass}>
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelClass}>Description</label>
            <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5 tracking-tight">
          Spécifications techniques
        </h3>
        <SpecsEditor specs={specs} onChange={setSpecs} />
      </div>

      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5 tracking-tight">
          Images
        </h3>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <button
        type="submit"
        className="px-8 py-3 rounded-[10px] bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors"
      >
        {product ? "Mettre à jour" : "Créer le produit"}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Create ProductTable**

Create `components/admin/ProductTable.tsx`:

```tsx
"use client";

import { PencilSimple, Trash } from "@phosphor-icons/react";
import { deleteProduct } from "@/lib/actions/products";
import { formatPrice, CONDITION_LABELS } from "@/lib/utils";
import type { Product } from "@/lib/types";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(id);
  }

  return (
    <div className="bg-white rounded-[14px] border border-admin-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-admin-bg border-b border-admin-border">
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Image</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Produit</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Catégorie</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Prix</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">État</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Stock</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-text-muted font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-admin-bg last:border-0">
              <td className="px-4 py-3">
                {p.images[0] ? (
                  <img src={p.images[0]} alt="" className="w-11 h-11 rounded-[8px] object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-[8px] bg-admin-bg" />
                )}
              </td>
              <td className="px-4 py-3 font-semibold text-sm text-surface-0">{p.name}</td>
              <td className="px-4 py-3 text-xs text-text-muted">{p.category}</td>
              <td className="px-4 py-3 text-sm font-semibold">{formatPrice(p.price)} EUR</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-semibold bg-accent/10 text-accent">
                  {p.condition}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-semibold ${
                    p.in_stock
                      ? "bg-admin-success/10 text-admin-success"
                      : "bg-admin-warning/10 text-admin-warning"
                  }`}
                >
                  {p.in_stock ? "En stock" : "Rupture"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="p-1.5 rounded-[6px] border border-admin-border hover:border-accent text-text-muted hover:text-accent transition-colors"
                  >
                    <PencilSimple size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-[6px] border border-admin-border hover:border-admin-warning text-text-muted hover:text-admin-warning transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="py-12 text-center text-text-muted text-sm">
          Aucun produit. Cliquez sur "Ajouter un produit" pour commencer.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create admin product pages**

Create `app/(admin)/admin/products/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/admin/ProductTable";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight">
          Produits
        </h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-accent text-white font-semibold text-[13px] hover:bg-accent-light transition-colors"
        >
          <Plus size={16} weight="bold" />
          Ajouter un produit
        </Link>
      </div>
      <ProductTable products={products ?? []} />
    </div>
  );
}
```

Create `app/(admin)/admin/products/new/page.tsx`:

```tsx
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight mb-6">
        Nouveau produit
      </h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
```

Create `app/(admin)/admin/products/[id]/edit/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight mb-6">
        Modifier : {product.name}
      </h1>
      <ProductForm product={product} action={boundAction} />
    </div>
  );
}
```

- [ ] **Step 7: Verify product CRUD**

Run: `npm run dev`
- Navigate to `/admin/products` — see product table with seed data
- Click "Ajouter un produit" — fill form, upload images, add specs, submit
- Verify new product appears in table and on landing page
- Click edit on a product — modify fields, save
- Click delete — confirm deletion

- [ ] **Step 8: Commit**

```bash
git add lib/actions/ components/admin/ app/(admin)/admin/products/
git commit -m "feat: implement admin product CRUD with image upload and specs editor"
```

---

## Task 8: Admin Content & Settings Pages

**Files:**
- Create: `lib/actions/content.ts`, `lib/actions/settings.ts`
- Create: `components/admin/ContentEditor.tsx`
- Create: `app/(admin)/admin/content/page.tsx`, `app/(admin)/admin/settings/page.tsx`

- [ ] **Step 1: Create content server actions**

Create `lib/actions/content.ts`:

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(section: string, content: Record<string, unknown>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section, content, updated_at: new Date().toISOString() },
      { onConflict: "section" }
    );

  if (error) throw new Error(error.message);
  revalidatePath("/");
}
```

- [ ] **Step 2: Create settings server actions**

Create `lib/actions/settings.ts`:

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(entries: { key: string; value: string }[]) {
  const supabase = await createClient();

  for (const entry of entries) {
    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
}
```

- [ ] **Step 3: Create ContentEditor**

Create `components/admin/ContentEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { updateSiteContent } from "@/lib/actions/content";
import { ImageUploader } from "./ImageUploader";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
  Product,
} from "@/lib/types";
import { Plus, Trash } from "@phosphor-icons/react";

interface ContentEditorProps {
  hero: HeroContent;
  featuredProduct: FeaturedProductContent;
  values: ValuesContent;
  testimonials: TestimonialsContent;
  cta: CTAContent;
  products: Product[];
}

export function ContentEditor({
  hero: initialHero,
  featuredProduct: initialFeatured,
  values: initialValues,
  testimonials: initialTestimonials,
  cta: initialCta,
  products,
}: ContentEditorProps) {
  const [hero, setHero] = useState(initialHero);
  const [featured, setFeatured] = useState(initialFeatured);
  const [values, setValues] = useState(initialValues);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [cta, setCta] = useState(initialCta);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await Promise.all([
      updateSiteContent("hero", hero as any),
      updateSiteContent("featured_product", featured as any),
      updateSiteContent("values", values as any),
      updateSiteContent("testimonials", testimonials as any),
      updateSiteContent("cta", cta as any),
    ]);
    setSaving(false);
    alert("Contenu mis à jour !");
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-[10px] border border-admin-border bg-admin-bg font-body text-sm focus:border-accent outline-none";
  const labelClass =
    "text-[12px] font-semibold text-text-muted uppercase tracking-wide";

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Hero */}
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5">Section Hero</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelClass}>Titre principal</label>
            <input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelClass}>Sous-titre</label>
            <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows={3} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Bouton principal</label>
            <input value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Bouton secondaire</label>
            <input value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelClass}>Image de fond</label>
            <ImageUploader
              images={hero.background_image ? [hero.background_image] : []}
              onChange={(imgs) => setHero({ ...hero, background_image: imgs[0] ?? "" })}
              bucket="site-assets"
            />
          </div>
        </div>
      </div>

      {/* Featured product */}
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5">Produit vedette</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelClass}>Produit</label>
            <select value={featured.product_id} onChange={(e) => setFeatured({ ...featured, product_id: e.target.value })} className={inputClass}>
              <option value="">— Sélectionner —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} EUR
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Label</label>
            <input value={featured.label} onChange={(e) => setFeatured({ ...featured, label: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Sous-titre</label>
            <input value={featured.subtitle} onChange={(e) => setFeatured({ ...featured, subtitle: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5">Valeurs</h3>
        {values.items.map((item, i) => (
          <div key={i} className="border border-admin-border rounded-[10px] p-4 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Titre</label>
                <input
                  value={item.title}
                  onChange={(e) => {
                    const items = [...values.items];
                    items[i] = { ...items[i], title: e.target.value };
                    setValues({ items });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Icône (Phosphor)</label>
                <input
                  value={item.icon}
                  onChange={(e) => {
                    const items = [...values.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    setValues({ items });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className={labelClass}>Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const items = [...values.items];
                    items[i] = { ...items[i], description: e.target.value };
                    setValues({ items });
                  }}
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5">Témoignages</h3>
        {testimonials.items.map((item, i) => (
          <div key={i} className="border border-admin-border rounded-[10px] p-4 mb-3 relative">
            <button
              type="button"
              onClick={() => {
                const items = testimonials.items.filter((_, j) => j !== i);
                setTestimonials({ items });
              }}
              className="absolute top-3 right-3 text-text-muted hover:text-admin-warning"
            >
              <Trash size={14} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Nom</label>
                <input
                  value={item.name}
                  onChange={(e) => {
                    const items = [...testimonials.items];
                    items[i] = { ...items[i], name: e.target.value };
                    setTestimonials({ items });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Rôle</label>
                <input
                  value={item.role}
                  onChange={(e) => {
                    const items = [...testimonials.items];
                    items[i] = { ...items[i], role: e.target.value };
                    setTestimonials({ items });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Note (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={item.rating}
                  onChange={(e) => {
                    const items = [...testimonials.items];
                    items[i] = { ...items[i], rating: parseInt(e.target.value) };
                    setTestimonials({ items });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className={labelClass}>Commentaire</label>
                <textarea
                  value={item.comment}
                  onChange={(e) => {
                    const items = [...testimonials.items];
                    items[i] = { ...items[i], comment: e.target.value };
                    setTestimonials({ items });
                  }}
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setTestimonials({
              items: [
                ...testimonials.items,
                { name: "", role: "", rating: 5, comment: "" },
              ],
            })
          }
          className="flex items-center gap-1.5 text-accent text-[13px] font-medium mt-2"
        >
          <Plus size={14} /> Ajouter un témoignage
        </button>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-[14px] border border-admin-border p-7">
        <h3 className="font-headline text-base font-bold mb-5">Section CTA</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Titre</label>
            <input value={cta.title} onChange={(e) => setCta({ ...cta, title: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Sous-titre</label>
            <input value={cta.subtitle} onChange={(e) => setCta({ ...cta, subtitle: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Texte du bouton</label>
            <input value={cta.button_text} onChange={(e) => setCta({ ...cta, button_text: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-3 rounded-[10px] bg-admin-success text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create admin content page**

Create `app/(admin)/admin/content/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { ContentEditor } from "@/components/admin/ContentEditor";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
} from "@/lib/types";

const DEFAULTS = {
  hero: { title: "", subtitle: "", cta_primary: "Voir la collection", cta_secondary: "Notre processus", background_image: "" },
  featured_product: { product_id: "", label: "", subtitle: "" },
  values: { items: [] },
  testimonials: { items: [] },
  cta: { title: "", subtitle: "", button_text: "Explorer la collection" },
};

export default async function AdminContentPage() {
  const supabase = await createClient();

  const { data: sections } = await supabase.from("site_content").select("*");
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("name");

  function getContent<T>(section: string, fallback: T): T {
    const found = sections?.find((s) => s.section === section);
    return (found?.content as T) ?? fallback;
  }

  return (
    <div>
      <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight mb-6">
        Contenu de la Landing Page
      </h1>
      <ContentEditor
        hero={getContent<HeroContent>("hero", DEFAULTS.hero as HeroContent)}
        featuredProduct={getContent<FeaturedProductContent>("featured_product", DEFAULTS.featured_product as FeaturedProductContent)}
        values={getContent<ValuesContent>("values", DEFAULTS.values as ValuesContent)}
        testimonials={getContent<TestimonialsContent>("testimonials", DEFAULTS.testimonials as TestimonialsContent)}
        cta={getContent<CTAContent>("cta", DEFAULTS.cta as CTAContent)}
        products={products ?? []}
      />
    </div>
  );
}
```

- [ ] **Step 5: Create admin settings page**

Create `app/(admin)/admin/settings/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "@/lib/actions/settings";

const SETTING_KEYS = [
  { key: "whatsapp_number", label: "Numéro WhatsApp", placeholder: "+261340000000" },
  { key: "email", label: "Email de contact", placeholder: "contact@asetech.mg" },
  { key: "phone", label: "Téléphone", placeholder: "+261340000000" },
  { key: "site_title", label: "Titre du site (SEO)", placeholder: "ASE TECH" },
  { key: "site_description", label: "Description du site (SEO)", placeholder: "Appareils Apple reconditionnés..." },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      setValues(map);
      setLoaded(true);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const entries = Object.entries(values).map(([key, value]) => ({ key, value }));
    await updateSettings(entries);
    setSaving(false);
    alert("Paramètres enregistrés !");
  }

  if (!loaded) return <div className="text-text-muted text-sm">Chargement...</div>;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-[10px] border border-admin-border bg-admin-bg font-body text-sm focus:border-accent outline-none";

  return (
    <div>
      <h1 className="font-headline text-xl font-bold text-surface-0 tracking-tight mb-6">
        Paramètres
      </h1>
      <div className="bg-white rounded-[14px] border border-admin-border p-7 max-w-xl space-y-4">
        {SETTING_KEYS.map((s) => (
          <div key={s.key} className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
              {s.label}
            </label>
            <input
              value={values[s.key] ?? ""}
              onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
              placeholder={s.placeholder}
              className={inputClass}
            />
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-[10px] bg-admin-success text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify content and settings admin**

Run: `npm run dev`
- Navigate to `/admin/content` — verify all sections load with seed data
- Edit hero title, save — navigate to `/` and verify change appears (after revalidation)
- Navigate to `/admin/settings` — verify settings load and save

- [ ] **Step 7: Commit**

```bash
git add lib/actions/content.ts lib/actions/settings.ts components/admin/ContentEditor.tsx app/(admin)/admin/content/ app/(admin)/admin/settings/
git commit -m "feat: implement admin content editor and settings pages"
```

---

## Task 9: Final Polish & Verification

- [ ] **Step 1: Add .gitignore entries**

Verify `.gitignore` includes:

```
node_modules/
.next/
.env.local
.superpowers/
```

- [ ] **Step 2: Run full verification**

Run: `npm run dev`

1. Landing page: all sections render, animations work, marquee scrolls
2. Product catalog: filters work, cards link to detail pages
3. Product detail: gallery, specs, WhatsApp CTA link works
4. Admin login: redirects when not authenticated
5. Admin products: CRUD works, images upload
6. Admin content: edit hero/values/testimonials/CTA, changes reflect on landing
7. Admin settings: save WhatsApp number, verify on product detail page
8. Responsive: check mobile viewport, single column layout, no horizontal scroll

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete ASE TECH landing page and admin panel"
```
