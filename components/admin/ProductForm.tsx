"use client";

import { useState } from "react";
import type { Product, ProductCategory, ProductCondition } from "@/lib/types";
import { CONDITION_LABELS } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { SpecsEditor } from "./SpecsEditor";

const CATEGORIES: ProductCategory[] = [
  "iPhone",
  "MacBook",
  "iPad",
  "Watch",
  "AirPods",
  "Accessories",
];

const CONDITIONS: ProductCondition[] = ["pristine", "excellent", "good"];

interface ProductFormProps {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
}

export function ProductForm({ product, action }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [specs, setSpecs] = useState<Record<string, string>>(
    product?.specs ?? {}
  );

  const handleSubmit = async (formData: FormData) => {
    formData.set("images", JSON.stringify(images));
    formData.set("specs", JSON.stringify(specs));
    await action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Informations generales
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Nom du produit
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product?.name ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="iPhone 15 Pro Max 256Go"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Categorie
            </label>
            <select
              name="category"
              required
              defaultValue={product?.category ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="" disabled>
                Selectionner...
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Etat
            </label>
            <select
              name="condition"
              required
              defaultValue={product?.condition ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="" disabled>
                Selectionner...
              </option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {CONDITION_LABELS[cond]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Prix (Ar)
            </label>
            <input
              name="price"
              type="number"
              required
              defaultValue={product?.price ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="1500000"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Prix original (Ar)
            </label>
            <input
              name="original_price"
              type="number"
              defaultValue={product?.original_price ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="2000000"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              En stock
            </label>
            <select
              name="in_stock"
              defaultValue={
                product ? (product.in_stock ? "true" : "false") : "true"
              }
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Mis en avant
            </label>
            <select
              name="featured"
              defaultValue={
                product ? (product.featured ? "true" : "false") : "false"
              }
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="Description du produit..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Images
        </h2>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Specifications techniques
        </h2>
        <SpecsEditor specs={specs} onChange={setSpecs} />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-admin-success px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90"
        >
          {product ? "Mettre a jour" : "Creer le produit"}
        </button>
      </div>
    </form>
  );
}
