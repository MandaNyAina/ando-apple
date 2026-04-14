import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Category } from "@/lib/types";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("categories").select("*").eq("id", id).single();

  if (!data) {
    notFound();
  }

  const category = data as Category;

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
        Modifier la categorie
      </h1>
      <p className="mt-1 text-sm text-text-muted">{category.name}</p>
      <div className="mt-8">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
