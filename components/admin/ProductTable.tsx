"use client";

import Image from "next/image";
import Link from "next/link";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { Product } from "@/lib/types";
import { formatPrice, CONDITION_LABELS } from "@/lib/utils";
import { deleteProduct } from "@/lib/actions/products";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-admin-border bg-admin-card p-12 text-center">
        <p className="text-text-muted">Aucun produit pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-admin-border">
            <th className="px-4 py-3 font-medium text-text-muted">Image</th>
            <th className="px-4 py-3 font-medium text-text-muted">Produit</th>
            <th className="px-4 py-3 font-medium text-text-muted">Categorie</th>
            <th className="px-4 py-3 font-medium text-text-muted">Prix</th>
            <th className="px-4 py-3 font-medium text-text-muted">Etat</th>
            <th className="px-4 py-3 font-medium text-text-muted">Stock</th>
            <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-admin-border last:border-b-0">
              <td className="px-4 py-3">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg border border-admin-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-admin-border bg-admin-bg text-xs text-text-muted">
                    N/A
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-surface-0">{product.name}</td>
              <td className="px-4 py-3 text-text-muted">{product.category}</td>
              <td className="px-4 py-3 text-surface-0">{formatPrice(product.price)} Ar</td>
              <td className="px-4 py-3 text-text-muted">
                {CONDITION_LABELS[product.condition] ?? product.condition}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.in_stock
                      ? "bg-admin-success/10 text-admin-success"
                      : "bg-admin-warning/10 text-admin-warning"
                  }`}
                >
                  {product.in_stock ? "En stock" : "Rupture"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-admin-bg hover:text-admin-success"
                  >
                    <PencilSimple size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-admin-warning/10 hover:text-admin-warning"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
