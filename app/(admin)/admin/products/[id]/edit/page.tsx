import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
          Modifier le produit
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {(product as Product).name}
        </p>
      </div>

      <ProductForm
        product={product as Product}
        action={updateProductWithId}
      />
    </div>
  );
}
