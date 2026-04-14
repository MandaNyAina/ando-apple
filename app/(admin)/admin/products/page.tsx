import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/admin/ProductTable";
import type { Product } from "@/lib/types";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
            Produits
          </h1>
          <p className="mt-1 text-sm text-text-muted">Gerez votre catalogue de produits</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90"
        >
          <PlusIcon size={18} weight="bold" />
          Ajouter un produit
        </Link>
      </div>

      <div className="mt-8">
        <ProductTable products={(products as Product[]) ?? []} />
      </div>
    </div>
  );
}
