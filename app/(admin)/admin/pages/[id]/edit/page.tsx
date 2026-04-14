import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageForm } from "@/components/admin/PageForm";
import { updatePage } from "@/lib/actions/pages";
import type { Page } from "@/lib/types";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("*").eq("id", id).single();

  if (!page) {
    notFound();
  }

  const updatePageWithId = updatePage.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
          Modifier la page
        </h1>
        <p className="mt-1 text-sm text-text-muted">{(page as Page).title}</p>
      </div>

      <PageForm page={page as Page} action={updatePageWithId} />
    </div>
  );
}
