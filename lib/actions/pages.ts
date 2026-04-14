"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function createPage(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw || generateSlug(title);
  const content = (formData.get("content") as string) || "";
  const meta_title = (formData.get("meta_title") as string) || null;
  const meta_description = (formData.get("meta_description") as string) || null;
  const cta_text = (formData.get("cta_text") as string) || null;
  const cta_link = (formData.get("cta_link") as string) || null;
  const published = formData.get("published") === "true";
  const show_in_footer = formData.get("show_in_footer") === "true";

  const { error } = await supabase.from("pages").insert({
    title,
    slug,
    content,
    meta_title,
    meta_description,
    cta_text,
    cta_link,
    published,
    show_in_footer,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/admin/pages");
}

export async function updatePage(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw || generateSlug(title);
  const content = (formData.get("content") as string) || "";
  const meta_title = (formData.get("meta_title") as string) || null;
  const meta_description = (formData.get("meta_description") as string) || null;
  const cta_text = (formData.get("cta_text") as string) || null;
  const cta_link = (formData.get("cta_link") as string) || null;
  const published = formData.get("published") === "true";
  const show_in_footer = formData.get("show_in_footer") === "true";

  const { error } = await supabase
    .from("pages")
    .update({
      title,
      slug,
      content,
      meta_title,
      meta_description,
      cta_text,
      cta_link,
      published,
      show_in_footer,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("pages").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/admin/pages");
}
