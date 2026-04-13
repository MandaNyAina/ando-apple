# ASE TECH — Landing Page & Admin Panel

## Context

ASE TECH is a business selling refurbished Apple products. They need a modern, premium landing page to showcase their products and an admin panel to manage content. This is a **presentation/showcase site** — no e-commerce for now, but the architecture should make it easy to add later.

The company already has a logo (geometric "ASE TECH" in steel-sage gray tones) and a DESIGN.md with editorial design guidelines.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS v4 |
| Typography | Outfit (headlines) + Satoshi (body) |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| File storage | Supabase Storage |
| Auth | Supabase Auth (email/password for admin) |
| Icons | @phosphor-icons/react |
| Deployment | TBD (architecture-agnostic) |

---

## Design System — "Steel Sage"

Palette derived from the ASE TECH logo's steel-sage gray tones.

### Colors

```
Surfaces (dark theme — public pages):
  --surface-0: #111614    (page background)
  --surface-1: #161b19    (elevated surface)
  --surface-2: #1c2220    (cards, containers)
  --surface-3: #232a28    (interactive elements)
  --surface-4: #2d3533    (hover states)

Accent:
  --accent:       #8a9e96  (primary accent — steel sage)
  --accent-light: #a8bab2  (accent hover / emphasis)
  --accent-muted: #697d75  (subtle accent)

Text:
  --text-primary:   #e8ebe9  (headings, body)
  --text-secondary: #9aaba5  (descriptions)
  --text-muted:     #5f706a  (labels, metadata)

Admin (light theme):
  Background: #f6f8f7
  Cards: #ffffff
  Borders: #e8ebe9
  Success: #4a8a6a
  Warning: #a06060
```

### Typography

- Headlines: `Outfit` — weight 700-800, tracking tight (-2px to -3px)
- Body: `Satoshi` — weight 400-500, leading relaxed
- NO Inter (banned by design skill)
- NO gradient text on large headers
- NO oversized H1s — control hierarchy with weight and color

### Layout Rules (DESIGN_VARIANCE=8)

- Hero sections: asymmetric split-screen (left text / right visual)
- NO centered hero layouts
- NO 3-column equal card grids — use zig-zag, bento, or asymmetric
- Bento grids: `grid-template-columns: 2fr 1fr 1fr`
- Full-height: `min-h-[100dvh]` (not `h-screen`)
- Max container: `max-w-[1400px] mx-auto`
- Mobile: collapse to single-column `w-full px-4`

### Motion (MOTION_INTENSITY=6)

- Framer Motion for all UI animations
- Spring physics: `type: "spring", stiffness: 100, damping: 20`
- Scroll-triggered reveals with `staggerChildren`
- No linear easing
- Transitions: `cubic-bezier(0.16, 1, 0.3, 1)`
- Button feedback: `scale(0.98)` on `:active`, `translateY(-1px)` on hover

### Component Patterns

- Borders: `1px solid rgba(138,158,150,0.04-0.15)` (range by emphasis)
- Border radius: `rounded-xl` (12px) for buttons/inputs, `rounded-2xl` (16-20px) for cards
- Glass panels: `backdrop-filter: blur(40px)` + inner border `border-white/10` + inner shadow
- NO neon/outer glows
- NO pure black (#000000)
- Shadows: tinted to background hue, wide-spreading

---

## Route Structure

```
app/
  layout.tsx              (root layout, fonts, metadata)
  page.tsx                (landing page — SSG/ISR)
  (public)/
    products/
      page.tsx            (product catalog grid)
      [slug]/page.tsx     (product detail — ISR)
  (admin)/
    admin/
      layout.tsx          (admin layout + Supabase auth guard)
      page.tsx            (dashboard — product count, recent activity)
      products/
        page.tsx          (product CRUD table)
        new/page.tsx      (add product form)
        [id]/edit/page.tsx (edit product form)
      content/page.tsx    (landing page content editor)
      login/page.tsx      (admin login)
```

---

## Database Schema

### Table: `products`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| slug | text | UNIQUE, NOT NULL, auto-generated |
| category | text | NOT NULL (iPhone, MacBook, iPad, Watch, AirPods, Accessories) |
| price | numeric | NOT NULL |
| original_price | numeric | nullable — for showing savings |
| condition | text | NOT NULL (pristine, excellent, good) |
| description | text | |
| specs | jsonb | Dynamic key-value specs (capacity, color, battery, screen...) |
| images | text[] | Array of Supabase Storage URLs |
| featured | boolean | default false — shown on landing hero |
| in_stock | boolean | default true |
| sort_order | integer | default 0 — for manual ordering |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### Table: `site_content`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| section | text | UNIQUE (hero, featured_product, values, testimonials, cta, footer) |
| content | jsonb | Section-specific content structure |
| updated_at | timestamptz | default now() |

**Content JSONB structures:**

```jsonc
// section: "hero"
{
  "title": "La precision du reconditionne.",
  "subtitle": "Chaque appareil passe par...",
  "cta_primary": "Voir la collection",
  "cta_secondary": "Notre processus",
  "background_image": "https://storage.supabase.io/..."
}

// section: "featured_product"
{
  "product_id": "uuid-of-product",
  "label": "Nouveau en stock",
  "subtitle": "Titane naturel. Reconditionne grade A+."
}

// section: "values"
{
  "items": [
    { "title": "...", "description": "...", "icon": "verified", "image": "url" },
    ...
  ]
}

// section: "testimonials"
{
  "items": [
    { "name": "Marie Lefebvre", "role": "Designer freelance", "rating": 5, "comment": "..." },
    ...
  ]
}
```

### Table: `categories`

Not needed initially — categories are a constrained text field on products. Can be promoted to a table later if needed.

### Supabase Storage

- Bucket: `product-images` (public read, admin write)
- Bucket: `site-assets` (public read, admin write) — hero backgrounds, value images

### Table: `settings`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| key | text | UNIQUE (whatsapp_number, email, phone, site_title, site_description) |
| value | text | |
| updated_at | timestamptz | default now() |

### Supabase Auth

- Single admin user (email/password)
- RLS policies: public read on products/site_content, admin-only write
- Auth guard in admin layout via middleware or server component check

---

## Pages

### 1. Landing Page (`/`)

**Sections (top to bottom):**

1. **Nav** — Fixed, glass-morphic. Logo ASE TECH, category links (iPhone, MacBook, iPad, Watch), search + cart icons. `backdrop-filter: blur(40px)`.

2. **Hero** — Asymmetric split: left text (tag + H1 + subtitle + 2 CTAs), right showcase card (featured product image with price overlay). Framer Motion fade-in + slide-up on load. All text/images editable from admin.

3. **Marquee strip** — Infinite horizontal scroll of trust points (Garantie 24 mois, Inspection 90 points, Livraison express...). CSS animation, duplicated content for seamless loop. Editable from admin.

4. **Featured product** — Full-width centered section. Product pulled from `site_content.featured_product` → joins to `products` table. Large image, price with strikethrough, dual CTA. Framer Motion scale-in on scroll.

5. **Gallery strip** — Infinite horizontal image scroll. Images from Supabase Storage (site-assets bucket). CSS `animation: scroll 35s linear infinite`. Editable from admin.

6. **Bento grid** — Asymmetric grid (`2fr 1fr 1fr`, 2 rows). Each card = product category with cover image, badge, title, link. Hover: scale(1.015) card + scale(1.06) image. Links to `/products?category=X`. Images from admin.

7. **Trust / Values** — Zig-zag layout (NOT 3 equal columns). Each value: large number (01, 02, 03), title, description, image. Framer Motion stagger reveal. Content from `site_content.values`.

8. **Testimonials** — 2-column offset grid (second card offset 40px down). Glass-morphic cards with stars, quote, author name + role + avatar. Content from `site_content.testimonials`.

9. **CTA** — Centered section with radial gradient glow (subtle, not neon). Title + subtitle + primary button. Editable from admin.

10. **Footer** — Logo, legal links, copyright.

### 2. Product Detail (`/products/[slug]`)

**Layout:** Asymmetric 2-column (1.3fr gallery / 1fr info)

- **Gallery:** Main image + thumbnail row (clickable). Images from `products.images[]`. Framer Motion `AnimatePresence` for image transitions.
- **Breadcrumb:** Products > Category > Product name
- **Title + condition badge:** Grade A+ / Excellent / Good with verified icon
- **Price block:** Current price (accent), original price (strikethrough), savings percentage
- **Specs table:** Dynamic from `products.specs` JSONB. Key-value rows with subtle dividers.
- **Description:** Rich text from `products.description`
- **CTAs:** "Nous contacter pour ce produit" (primary) + "Discuter sur WhatsApp" (outline with chat icon). No buy button (no e-commerce yet).
- **Warranty note:** Shield icon + "Garanti 24 mois par ASE Tech"

### 3. Product Catalog (`/products`)

- Filter bar: by category (tabs or pills), by condition, by price range
- Product grid: responsive, 2-3 columns
- Each card: image, name, category, price, condition badge, stock status
- Link to `/products/[slug]`

### 4. Admin — Products (`/admin/products`)

- **List view:** Table with image thumb, name, category, price, condition, stock, edit/delete actions
- **Add/Edit form:**
  - Product info: name, category (select), price, original_price, condition (select), stock (toggle)
  - Description: textarea
  - Specs: dynamic key-value fields (add/remove rows) — stored as JSONB
  - Images: drag & drop upload zone → Supabase Storage. Preview thumbnails with remove button. Reorderable.
- **Delete:** Confirmation modal before delete

### 5. Admin — Landing Content (`/admin/content`)

- **Hero editor:** Title, subtitle, CTA texts, background image upload
- **Featured product:** Dropdown selecting from existing products + label + subtitle
- **Values editor:** 3 blocks, each with title, icon name, description, image
- **Testimonials editor:** CRUD list — name, role, rating, comment. Add/remove
- **CTA editor:** Title, subtitle, button text

### 6. Admin — Settings (`/admin/settings`)

- **Contact info:** WhatsApp number (used for product detail CTA), email, phone
- **Site metadata:** Site title, description (for SEO)

### 7. Admin — Login (`/admin/login`)

- Simple email/password form
- Supabase Auth signIn
- Redirect to `/admin` on success

---

## Key Components

```
components/
  ui/
    Button.tsx          (solid + outline variants, motion feedback)
    Badge.tsx           (condition badges — pristine/excellent/good)
    Card.tsx            (bento card with image, overlay, hover effects)
  landing/
    Nav.tsx             (fixed glass nav, client component for scroll state)
    Hero.tsx            (asymmetric hero with Framer Motion)
    Marquee.tsx         (infinite horizontal text scroll)
    FeaturedProduct.tsx (full-width product spotlight)
    GalleryStrip.tsx    (infinite image carousel)
    BentoGrid.tsx       (category bento grid)
    TrustValues.tsx     (zig-zag values section)
    Testimonials.tsx    (2-col offset testimonial cards)
    CTASection.tsx      (final call to action)
    Footer.tsx
  product/
    ProductGallery.tsx  (main image + thumbnails, client component)
    ProductInfo.tsx     (price, specs, CTAs)
    ProductCard.tsx     (catalog card)
    ProductFilters.tsx  (category/condition/price filters, client component)
  admin/
    AdminSidebar.tsx    (navigation sidebar)
    ProductForm.tsx     (add/edit product form, client component)
    ProductTable.tsx    (product list table)
    ContentEditor.tsx   (landing page content forms)
    ImageUploader.tsx   (drag & drop + preview, Supabase Storage)
    AuthGuard.tsx       (redirect if not authenticated)
lib/
  supabase/
    client.ts           (browser client)
    server.ts           (server client for RSC)
    types.ts            (generated types from Supabase)
  utils.ts              (slug generation, price formatting)
```

---

## Data Flow

### Public pages (Landing, Product Detail)

1. Server Components fetch data from Supabase using server client
2. ISR with `revalidate: 60` (1 minute) for product pages
3. Landing page content fetched from `site_content` table
4. Products fetched from `products` table
5. Images served from Supabase Storage public URLs

### Admin pages

1. Auth guard checks Supabase session in admin layout
2. Client components for forms (React Hook Form or native)
3. Server Actions for mutations (create/update/delete product, update content)
4. Image upload: client-side upload to Supabase Storage, return URL
5. On content save: call `revalidatePath('/')` to refresh landing ISR cache

---

## E-commerce Readiness

The architecture is designed to make adding e-commerce straightforward later:

- `products` table already has price, stock, images — just add cart/order tables
- Replace "Nous contacter" CTA with "Ajouter au panier"
- Add Stripe integration for payments
- Add `orders` table in Supabase
- The product detail page layout already has the right structure for a buy flow

---

## Verification Plan

1. **Dev server:** `npm run dev` — verify landing page renders with all sections
2. **Supabase:** Seed sample products and site_content, verify data loads
3. **Admin:** Login, create a product with images, verify it appears on landing
4. **Content editing:** Edit hero text in admin, verify landing updates after revalidation
5. **Product detail:** Navigate to a product, verify gallery, specs, and CTAs work
6. **Responsive:** Check landing page on mobile viewport (single column, no horizontal scroll)
7. **Animations:** Verify scroll-triggered reveals, hover effects, marquee strip
8. **Auth:** Verify `/admin` redirects to login when not authenticated
