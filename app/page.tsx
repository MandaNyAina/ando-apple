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

const DEFAULT_HERO: HeroContent = {
  title: "La tech premium.Accessible à tous",
  subtitle:
    "Des produits Apple reconditionnés avec soin, garantis 24 mois. Qualité, fiabilité, prix juste.",
  cta_primary: "Découvrir nos produits",
  cta_secondary: "Nos engagements",
  background_image: "",
};

const DEFAULT_CTA: CTAContent = {
  title: "Prêt à passer au reconditionné premium ?",
  subtitle:
    "Rejoignez des milliers de clients satisfaits et faites le choix de la qualité à prix maîtrisé.",
  button_text: "Explorer la boutique",
};

async function getSiteContent(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("site_content")
    .select("section, content");

  const map = new Map<string, Record<string, unknown>>();
  if (data) {
    for (const row of data) {
      map.set(row.section, row.content as Record<string, unknown>);
    }
  }
  return map;
}

async function getFeaturedProduct(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("in_stock", true)
    .limit(1)
    .single();

  return (data as Product) ?? null;
}

export default async function Home() {
  const supabase = await createClient();

  const [contentMap, featuredProduct] = await Promise.all([
    getSiteContent(supabase),
    getFeaturedProduct(supabase),
  ]);

  const heroContent = (contentMap.get("hero") as unknown as HeroContent) ?? DEFAULT_HERO;
  const featuredProductContent = contentMap.get("featured_product") as unknown as FeaturedProductContent | undefined;
  const valuesContent = contentMap.get("values") as unknown as ValuesContent | undefined;
  const testimonialsContent = contentMap.get("testimonials") as unknown as TestimonialsContent | undefined;
  const ctaContent = (contentMap.get("cta") as unknown as CTAContent) ?? DEFAULT_CTA;

  return (
    <main className="bg-surface-0 text-text-primary">
      <Nav />
      <Hero content={heroContent} featuredProduct={featuredProduct} />
      <Marquee />
      {featuredProductContent && (
        <FeaturedProduct content={featuredProductContent} product={featuredProduct} />
      )}
      <GalleryStrip images={[]} />
      <BentoGrid categories={[]} />
      {valuesContent && <TrustValues content={valuesContent} />}
      {testimonialsContent && <Testimonials content={testimonialsContent} />}
      <CTASection content={ctaContent} />
      <Footer />
    </main>
  );
}
