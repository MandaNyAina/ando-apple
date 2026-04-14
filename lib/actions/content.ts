"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteContent(
  section: string,
  content: Record<string, unknown>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section, content, updated_at: new Date().toISOString() },
      { onConflict: "section" }
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}
