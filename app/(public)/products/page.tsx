import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { Product } from "@/lib/types";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; condition?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, condition } = await searchParams;
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

  const { data } = await query;
  const products = (data as Product[]) ?? [];

  return (
    <main className="bg-surface-0 text-text-primary min-h-screen">
      <Nav />

      <section className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="font-headline font-bold text-3xl md:text-4xl">
              Nos produits
            </h1>
            <p className="text-text-muted text-[15px]">
              {products.length} produit{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Suspense fallback={null}>
            <ProductFilters />
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
                Aucun produit ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
