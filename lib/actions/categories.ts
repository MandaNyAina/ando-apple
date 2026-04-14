"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  return supabase;
}

interface CategoryInput {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  badge?: string;
  visible_on_landing?: boolean;
  sort_order?: number;
}

export async function createCategory(input: CategoryInput) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("categories").insert({
    name: input.name,
    slug: input.slug,
    image: input.image ?? "",
    description: input.description ?? "",
    badge: input.badge ?? "",
    visible_on_landing: input.visible_on_landing ?? true,
    sort_order: input.sort_order ?? 0,
  });

  if (error) {
    console.error("[createCategory]", error);
    throw new Error("Erreur lors de la création de la catégorie.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await requireAuth();

  const { error } = await supabase
    .from("categories")
    .update({
      name: input.name,
      slug: input.slug,
      image: input.image ?? "",
      description: input.description ?? "",
      badge: input.badge ?? "",
      visible_on_landing: input.visible_on_landing ?? true,
      sort_order: input.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateCategory]", error);
    throw new Error("Erreur lors de la mise à jour de la catégorie.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteCategory(id: string) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("[deleteCategory]", error);
    throw new Error("Erreur lors de la suppression de la catégorie.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
}
