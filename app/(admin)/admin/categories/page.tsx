import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryTable } from "@/components/admin/CategoryTable";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const categories = (data as Category[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
            Categories
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {categories.length} categorie{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-[14px] bg-admin-success px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90"
        >
          + Nouvelle categorie
        </Link>
      </div>

      <div className="mt-6">
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
}
