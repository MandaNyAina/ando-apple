"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  return supabase;
}

function parseJsonSafe<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAuth();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const priceRaw = parseFloat(formData.get("price") as string);
  const price = Number.isFinite(priceRaw) && priceRaw >= 0 ? priceRaw : 0;
  const originalPriceRaw = formData.get("original_price") as string;
  const original_price =
    originalPriceRaw && Number.isFinite(parseFloat(originalPriceRaw))
      ? parseFloat(originalPriceRaw)
      : null;
  const condition = formData.get("condition") as string;
  const description = (formData.get("description") as string) || null;
  const in_stock = formData.get("in_stock") === "true";
  const featured = formData.get("featured") === "true";
  const warrantyRaw = formData.get("warranty_months") as string;
  const warranty_months =
    warrantyRaw && Number.isFinite(parseInt(warrantyRaw)) && parseInt(warrantyRaw) > 0
      ? parseInt(warrantyRaw)
      : null;
  const images = parseJsonSafe<string[]>((formData.get("images") as string) || "[]", []);
  const specs = parseJsonSafe<Record<string, string>>(
    (formData.get("specs") as string) || "{}",
    {},
  );
  const slug = generateSlug(name);

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    category,
    price,
    original_price,
    condition,
    description,
    in_stock,
    featured,
    warranty_months,
    images,
    specs,
  });

  if (error) {
    console.error("[createProduct]", error);
    throw new Error("Erreur lors de la création du produit.");
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await requireAuth();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const priceRaw = parseFloat(formData.get("price") as string);
  const price = Number.isFinite(priceRaw) && priceRaw >= 0 ? priceRaw : 0;
  const originalPriceRaw = formData.get("original_price") as string;
  const original_price =
    originalPriceRaw && Number.isFinite(parseFloat(originalPriceRaw))
      ? parseFloat(originalPriceRaw)
      : null;
  const condition = formData.get("condition") as string;
  const description = (formData.get("description") as string) || null;
  const in_stock = formData.get("in_stock") === "true";
  const featured = formData.get("featured") === "true";
  const warrantyRaw = formData.get("warranty_months") as string;
  const warranty_months =
    warrantyRaw && Number.isFinite(parseInt(warrantyRaw)) && parseInt(warrantyRaw) > 0
      ? parseInt(warrantyRaw)
      : null;
  const images = parseJsonSafe<string[]>((formData.get("images") as string) || "[]", []);
  const specs = parseJsonSafe<Record<string, string>>(
    (formData.get("specs") as string) || "{}",
    {},
  );
  const slug = generateSlug(name);

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      category,
      price,
      original_price,
      condition,
      description,
      in_stock,
      featured,
      warranty_months,
      images,
      specs,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateProduct]", error);
    throw new Error("Erreur lors de la mise à jour du produit.");
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await requireAuth();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[deleteProduct]", error);
    throw new Error("Erreur lors de la suppression du produit.");
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}
