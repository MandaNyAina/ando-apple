import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
        Nouvelle categorie
      </h1>
      <p className="mt-1 text-sm text-text-muted">Ajouter une nouvelle categorie de produits</p>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  );
}
