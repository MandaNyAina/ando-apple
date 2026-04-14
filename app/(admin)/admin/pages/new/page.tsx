import { PageForm } from "@/components/admin/PageForm";
import { createPage } from "@/lib/actions/pages";

export default function NewPagePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
          Nouvelle page
        </h1>
        <p className="mt-1 text-sm text-text-muted">Creez une nouvelle page statique</p>
      </div>

      <PageForm action={createPage} />
    </div>
  );
}
