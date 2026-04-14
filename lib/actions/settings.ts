"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(
  entries: { key: string; value: string }[]
) {
  const supabase = await createClient();

  for (const entry of entries) {
    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/");
}
