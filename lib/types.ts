export type ProductCondition = "pristine" | "excellent" | "good";

export type ProductCategory = "iPhone" | "MacBook" | "iPad" | "Watch" | "AirPods" | "Accessories";

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
  warranty_months: number | null;
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
  hero_product_id: string;
  badge?: string;
}

export interface MarqueeContent {
  items: string[];
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

export interface GalleryItem {
  image: string;
  product_id: string;
}

export interface GalleryContent {
  items: GalleryItem[];
}

export interface BentoCategory {
  title: string;
  image: string;
  href: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  badge: string;
  visible_on_landing: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  published: boolean;
  show_in_footer: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
