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

export async function updateSettings(entries: { key: string; value: string }[]) {
  const supabase = await requireAuth();

  const results = await Promise.all(
    entries.map((entry) =>
      supabase
        .from("settings")
        .upsert(
          { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        ),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("[updateSettings]", failed.error);
    throw new Error("Erreur lors de la mise à jour des paramètres.");
  }

  revalidatePath("/");
}
