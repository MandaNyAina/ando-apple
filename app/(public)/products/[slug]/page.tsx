import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLogoUrl, getVisibleCategories } from "@/lib/data";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import type { Product, Setting } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("name, description, images, price")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Produit introuvable — ASE TECH" };
  }

  return {
    title: `${data.name} — ASE TECH`,
    description: data.description ?? `Découvrez le ${data.name} reconditionné chez ASE TECH.`,
    openGraph: {
      title: `${data.name} — ASE TECH`,
      description: data.description ?? `Découvrez le ${data.name} reconditionné chez ASE TECH.`,
      images: data.images?.[0] ? [{ url: data.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: productData }, { data: settingData }, logoUrl, categories] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single(),
    supabase
      .from("settings")
      .select("value")
      .eq("key", "whatsapp_number")
      .single(),
    getLogoUrl(),
    getVisibleCategories(),
  ]);

  if (!productData) {
    notFound();
  }

  const product = productData as Product;
  const whatsappNumber = (settingData as Pick<Setting, "value"> | null)?.value ?? "";

  return (
    <main className="bg-surface-0 text-text-primary min-h-screen">
      <Nav logoUrl={logoUrl} categories={categories} />

      <section className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} whatsappNumber={whatsappNumber} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
