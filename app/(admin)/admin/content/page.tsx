import { createClient } from "@/lib/supabase/server";
import { ContentEditor } from "@/components/admin/ContentEditor";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
  GalleryContent,
  MarqueeContent,
} from "@/lib/types";

const defaultHero: HeroContent = {
  title: "Bienvenue chez ASE TECH",
  subtitle: "Les meilleurs produits Apple reconditionnés",
  cta_primary: "Voir les produits",
  cta_secondary: "En savoir plus",
  background_image: "",
  hero_product_id: "",
  badge: "Reconditionné premium",
};

const defaultFeaturedProduct: FeaturedProductContent = {
  product_id: "",
  label: "Produit vedette",
  subtitle: "Notre sélection du moment",
};

const defaultValues: ValuesContent = {
  items: [
    {
      title: "Qualité",
      icon: "ShieldCheck",
      description: "Produits vérifiés et certifiés",
      image: "",
    },
    { title: "Service", icon: "Headset", description: "Support client réactif", image: "" },
    { title: "Prix", icon: "Tag", description: "Les meilleurs prix du marché", image: "" },
  ],
};

const defaultTestimonials: TestimonialsContent = {
  items: [],
};

const defaultCta: CTAContent = {
  title: "Prêt à passer commande ?",
  subtitle: "Contactez-nous dès maintenant",
  button_text: "Nous contacter",
};

const defaultMarquee: MarqueeContent = {
  items: [
    "Garantie 24 mois",
    "Inspection 90 points",
    "Livraison express",
    "Satisfait ou remboursé",
    "Batterie certifiée",
    "Économie circulaire",
    "Support technique dédié",
    "Paiement sécurisé",
  ],
};

export default async function AdminContentPage() {
  const supabase = await createClient();

  const { data: sections } = await supabase.from("site_content").select("*");
  const { data: products } = await supabase.from("products").select("*").order("name");

  const getSection = <T,>(name: string, fallback: T): T => {
    const found = sections?.find((s) => s.section === name);
    return found ? (found.content as T) : fallback;
  };

  const hero = getSection<HeroContent>("hero", defaultHero);
  const featuredProduct = getSection<FeaturedProductContent>(
    "featured_product",
    defaultFeaturedProduct,
  );
  const values = getSection<ValuesContent>("values", defaultValues);
  const testimonials = getSection<TestimonialsContent>("testimonials", defaultTestimonials);
  const cta = getSection<CTAContent>("cta", defaultCta);
  const gallery = getSection<GalleryContent>("gallery", { items: [] });
  const marquee = getSection<MarqueeContent>("marquee", defaultMarquee);

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
        Contenu du site
      </h1>
      <p className="mt-1 text-sm text-text-muted">Gérez le contenu de votre page d&apos;accueil</p>

      <div className="mt-8">
        <ContentEditor
          hero={hero}
          featuredProduct={featuredProduct}
          values={values}
          testimonials={testimonials}
          cta={cta}
          gallery={gallery}
          marquee={marquee}
          products={products ?? []}
        />
      </div>
    </div>
  );
}
