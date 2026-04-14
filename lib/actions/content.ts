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

export async function updateSiteContent(section: string, content: Record<string, unknown>) {
  const supabase = await requireAuth();

  const { error } = await supabase
    .from("site_content")
    .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: "section" });

  if (error) {
    console.error("[updateSiteContent]", error);
    throw new Error("Erreur lors de la mise à jour du contenu.");
  }

  revalidatePath("/");
}
