import { createClient } from "@/lib/supabase/server";
import { getLogoUrl, getVisibleCategories } from "@/lib/data";
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
  GalleryContent,
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

const DEFAULT_VALUES: ValuesContent = {
  items: [
    {
      title: "Garantie 24 mois",
      description:
        "Chaque produit est couvert par une garantie complète de 24 mois. Votre tranquillité d'esprit est notre priorité.",
      icon: "ShieldCheck",
      image: "",
    },
    {
      title: "Inspection rigoureuse",
      description:
        "90 points de contrôle pour chaque appareil. Nous ne faisons aucun compromis sur la qualité.",
      icon: "MagnifyingGlass",
      image: "",
    },
    {
      title: "Prix accessibles",
      description:
        "Des produits Apple premium jusqu'à 40% moins chers que le neuf, sans compromis sur la qualité.",
      icon: "Tag",
      image: "",
    },
  ],
};

const DEFAULT_TESTIMONIALS: TestimonialsContent = {
  items: [
    {
      name: "Hery Rakoto",
      role: "Client iPhone",
      rating: 5,
      comment:
        "Mon iPhone reconditionné est comme neuf. Service impeccable et livraison rapide à Antananarivo.",
    },
    {
      name: "Naina Razafy",
      role: "Cliente MacBook",
      rating: 5,
      comment:
        "Excellent rapport qualité-prix pour mon MacBook Air. Je recommande ASE TECH à tous mes collègues.",
    },
    {
      name: "Tiana Andria",
      role: "Client iPad",
      rating: 4,
      comment:
        "Très satisfait de mon iPad. La garantie 24 mois est vraiment rassurante.",
    },
  ],
};

const DEFAULT_FEATURED_PRODUCT: FeaturedProductContent = {
  product_id: "",
  label: "Produit vedette",
  subtitle: "Notre sélection du moment, reconditionnée avec soin.",
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

async function getFeaturedProducts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(2);

  return (data as Product[]) ?? [];
}

export default async function Home() {
  const supabase = await createClient();

  const [contentMap, featuredProducts, logoUrl, categories] = await Promise.all([
    getSiteContent(supabase),
    getFeaturedProducts(supabase),
    getLogoUrl(),
    getVisibleCategories(),
  ]);

  const heroContent = (contentMap.get("hero") as unknown as HeroContent) ?? DEFAULT_HERO;
  const featuredProductContent = (contentMap.get("featured_product") as unknown as FeaturedProductContent) ?? DEFAULT_FEATURED_PRODUCT;
  const valuesContent = (contentMap.get("values") as unknown as ValuesContent) ?? DEFAULT_VALUES;
  const testimonialsContent = (contentMap.get("testimonials") as unknown as TestimonialsContent) ?? DEFAULT_TESTIMONIALS;
  const ctaContent = (contentMap.get("cta") as unknown as CTAContent) ?? DEFAULT_CTA;

  const heroProduct = featuredProducts[0] ?? null;
  const secondFeaturedProduct = featuredProducts[1] ?? null;

  // Resolve gallery items with product slugs
  const galleryRaw = contentMap.get("gallery") as unknown as GalleryContent | undefined;
  let galleryItems: { image: string; link: string }[] = [];
  if (galleryRaw?.items && galleryRaw.items.length > 0) {
    const productIds = galleryRaw.items
      .map((item) => item.product_id)
      .filter((id) => id && id.length > 0);

    let slugMap = new Map<string, string>();
    if (productIds.length > 0) {
      const { data: linkedProducts } = await supabase
        .from("products")
        .select("id, slug")
        .in("id", productIds);
      if (linkedProducts) {
        for (const p of linkedProducts) {
          slugMap.set(p.id, p.slug);
        }
      }
    }

    galleryItems = galleryRaw.items.map((item) => ({
      image: item.image,
      link: item.product_id && slugMap.has(item.product_id)
        ? `/products/${slugMap.get(item.product_id)}`
        : "",
    }));
  }

  return (
    <main className="bg-surface-0 text-text-primary">
      <Nav logoUrl={logoUrl} categories={categories} />
      <Hero content={heroContent} featuredProduct={heroProduct} />
      <Marquee />
      {secondFeaturedProduct && (
        <FeaturedProduct content={featuredProductContent} product={secondFeaturedProduct} />
      )}
      <GalleryStrip items={galleryItems} />
      <BentoGrid categories={categories} />
      <TrustValues content={valuesContent} />
      <Testimonials content={testimonialsContent} />
      <CTASection content={ctaContent} />
      <Footer />
    </main>
  );
}
