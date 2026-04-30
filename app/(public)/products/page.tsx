import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getLogoUrl, getVisibleCategories, getWhatsappNumber } from "@/lib/data";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; condition?: string; search?: string }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { category, search } = await searchParams;
  const title = search
    ? `Résultats pour "${search}" — ASE TECH`
    : category
      ? `${category} reconditionné — ASE TECH`
      : "Tous nos produits — ASE TECH";
  return {
    title,
    description:
      "Découvrez notre catalogue de produits Apple reconditionnés. Qualité premium, prix accessible, garantie 24 mois.",
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, condition, search } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  if (condition) {
    query = query.eq("condition", condition);
  }

  if (search) {
    const sanitized = search.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("name", `%${sanitized}%`);
  }

  const [{ data }, logoUrl, visibleCategories, whatsappNumber] = await Promise.all([
    query,
    getLogoUrl(),
    getVisibleCategories(),
    getWhatsappNumber(),
  ]);

  const products = (data as Product[]) ?? [];

  return (
    <main className="bg-surface-0 text-text-primary min-h-screen">
      <Nav logoUrl={logoUrl} whatsappNumber={whatsappNumber} />

      <section className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="font-headline font-bold text-3xl md:text-4xl">
              {search ? `Résultats pour "${search}"` : "Nos produits"}
            </h1>
            <p className="text-text-muted text-[15px]">
              {products.length} produit{products.length !== 1 ? "s" : ""} disponible
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Suspense fallback={null}>
            <ProductFilters categories={visibleCategories} />
          </Suspense>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                Aucun produit ne correspond a votre recherche.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
