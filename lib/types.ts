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
