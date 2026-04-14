import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
          Nouveau produit
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Ajoutez un nouveau produit au catalogue
        </p>
      </div>

      <ProductForm action={createProduct} />
    </div>
  );
}
