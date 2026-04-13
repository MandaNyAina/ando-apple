```markdown
# Design System: High-End Editorial Tech

## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Curator"
This design system moves away from the "e-commerce marketplace" aesthetic and toward a "curated gallery" experience. We are not just selling refurbished tech; we are presenting precision-engineered artifacts. The design breaks the rigid, templated grid through intentional asymmetry, dramatic typography scales, and a sense of "atmospheric depth." 

The goal is to evoke the feeling of a high-end architecture magazine. We use white space (or in this case, "dark space") as a luxury commodity. By utilizing deep contrast and glass-like surfaces, we create an environment where the products—high-quality, high-detail photography—become the singular focus.

---

## 2. Colors

The palette is rooted in "Titanium Grays" and "Deep Blacks," punctuated by a surgical, high-energy cyan accent.

### Surface Hierarchy & The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections. Layout boundaries must be defined solely through background color shifts or tonal transitions.
- **Base Layer:** Use `surface` (`#131313`) for the primary page background.
- **Sectioning:** Use `surface-container-low` (`#1c1b1b`) to subtly distinguish a new content area.
- **Nesting:** To create "nested" depth, place a `surface-container-highest` (`#353534`) element inside a `surface-container-low` section. This creates a soft, tactile lift that feels integrated, not "pasted on."

### The "Glass & Gradient" Rule
To elevate the UI beyond standard flat design:
- **Floating Elements:** Use semi-transparent versions of `surface-container-high` combined with a `backdrop-filter: blur(20px)` to create a glassmorphic effect for navigation bars and modal overlays.
- **Signature CTAs:** Main actions should utilize a subtle linear gradient transitioning from `primary` (`#00daf3`) to `on-primary-container` (`#008a9a`) at a 135-degree angle. This provides a "glow" that flat colors lack.

---

## 3. Typography

The typography strategy relies on the tension between the geometric authority of **Manrope** and the functional sophistication of **Inter**.

- **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) and `headline-lg` (2rem) to create editorial "moments." Don't be afraid to let a headline overlap a product image or bleed toward the edge of the frame to create an asymmetric, custom feel.
- **Body & Labels (Inter):** Use `body-lg` (1rem) for product descriptions and `label-md` (0.75rem) for technical specifications. The tight tracking and bold weights of Inter provide a "precision-engineered" look.
- **The Hierarchy:** Always maintain a high contrast in scale. A `display-md` title paired with a `label-sm` technical detail creates a sophisticated, data-rich aesthetic found in high-end tech catalogs.

---

## 4. Elevation & Depth

We convey importance through **Tonal Layering** rather than traditional structural lines.

### The Layering Principle
Depth is achieved by stacking the surface-container tokens. For example:
- **Level 0:** `surface-container-lowest` (Deepest depth/background).
- **Level 1:** `surface` (The main canvas).
- **Level 2:** `surface-container-high` (Cards or featured modules).

### Ambient Shadows
When a "floating" effect is required (e.g., a product hover state):
- Shadows must be extra-diffused. Use a blur value of `32px` to `64px`.
- **Shadow Color:** Do not use pure black. Use a tinted version of `on-surface` (`#e5e2e1`) at a 4%–6% opacity. This mimics how light interacts with premium matte materials.

### The "Ghost Border" Fallback
If a border is required for accessibility in a high-density data view, use a **Ghost Border**:
- Token: `outline-variant` (`#444748`) at **15% opacity**.
- 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `on-primary-container`), white text (`on-primary`), with a `md` (0.375rem) corner radius. 
- **Secondary (The Glass Button):** `surface-container-highest` with 40% opacity and a `backdrop-blur`. No fill.
- **States:** On hover, the primary button should increase its "outer glow" using a `primary` colored ambient shadow.

### Cards & Gallery Modules
- **Rule:** Forbid divider lines. Use `surface-container-low` for the card body on a `surface` background.
- **Product Presentation:** Images should be "hero-sized," utilizing the full width of the card. Text should be inset using the Spacing Scale (typically 24px/1.5rem) to provide breathing room.
- **Corner Radius:** All cards must use the `lg` (0.5rem) token for a subtle, sophisticated curve.

### Selection Chips
- Use `secondary-container` (`#3e494a`) for unselected states and `primary` (`#00daf3`) with `on-primary` (`#00363d`) text for selected states.
- Shape: Use the `full` (9999px) radius token for a "pill" look that contrasts against the sharper 8px edges of cards.

### Input Fields
- **Styling:** Use `surface-container-highest` as the background fill.
- **Active State:** Instead of a thick border, use a 1px `primary` underline or a subtle `primary` outer glow to indicate focus.

---

## 6. Do's and Don'ts

### Do
- **DO** use intentional asymmetry. Align a headline to the left and a product description to the far right to create a "visual journey."
- **DO** lean into the "Titanium" aesthetic. Use the `secondary` and `tertiary` gray tokens to create a monochromatic, premium feel.
- **DO** use high-quality imagery with consistent lighting. Refurbished tech should look brand new—focus on macro shots of glass, metal, and lens textures.

### Don't
- **DON'T** use 1px solid dividers. If you need to separate content, use white space or a subtle shift from `surface` to `surface-container-low`.
- **DON'T** use standard "Material Design" shadows. Keep them soft, large, and tinted.
- **DON'T** crowd the UI. If the design feels busy, increase the padding. Luxury is defined by the space you *don't* fill.
- **DON'T** use the `primary` accent color for everything. It is a "surgical" tool; use it only for CTAs, active states, and critical highlights. Overusing it breaks the high-end editorial vibe.

---
*Director's Note: Treat every screen like a spread in a premium gallery catalog. If it looks like a standard app, you haven't used enough space or enough depth.*```