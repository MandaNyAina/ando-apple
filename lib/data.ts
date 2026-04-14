import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");

  const map: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      map[row.key] = row.value;
    }
  }
  return map;
}

export async function getLogoUrl(): Promise<string> {
  const settings = await getSiteSettings();
  return settings.logo_url || "";
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as Category[]) ?? [];
}

export async function getVisibleCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("visible_on_landing", true)
    .order("sort_order", { ascending: true });

  return (data as Category[]) ?? [];
}
