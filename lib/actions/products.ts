"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const originalPriceRaw = formData.get("original_price") as string;
  const original_price = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const condition = formData.get("condition") as string;
  const description = (formData.get("description") as string) || null;
  const in_stock = formData.get("in_stock") === "true";
  const featured = formData.get("featured") === "true";
  const images = JSON.parse((formData.get("images") as string) || "[]");
  const specs = JSON.parse((formData.get("specs") as string) || "{}");
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
    images,
    specs,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const originalPriceRaw = formData.get("original_price") as string;
  const original_price = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const condition = formData.get("condition") as string;
  const description = (formData.get("description") as string) || null;
  const in_stock = formData.get("in_stock") === "true";
  const featured = formData.get("featured") === "true";
  const images = JSON.parse((formData.get("images") as string) || "[]");
  const specs = JSON.parse((formData.get("specs") as string) || "{}");
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
      images,
      specs,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}
