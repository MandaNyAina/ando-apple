"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();

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
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await createClient();

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
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
}
