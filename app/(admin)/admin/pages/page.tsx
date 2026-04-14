import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { PageTable } from "@/components/admin/PageTable";
import type { Page } from "@/lib/types";

export default async function AdminPagesPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">Pages</h1>
          <p className="mt-1 text-sm text-text-muted">Gerez les pages statiques du site</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90"
        >
          <Plus size={18} weight="bold" />
          Ajouter une page
        </Link>
      </div>

      <div className="mt-8">
        <PageTable pages={(pages as Page[]) ?? []} />
      </div>
    </div>
  );
}
