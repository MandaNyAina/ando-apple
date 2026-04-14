"use client";

import { useState } from "react";
import Link from "next/link";
import { PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { deleteCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette categorie ?")) return;
    setDeleting(id);
    try {
      await deleteCategory(id);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-[14px] border border-admin-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border text-left text-text-muted">
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Badge</th>
            <th className="px-4 py-3 font-medium text-center">Visible</th>
            <th className="px-4 py-3 font-medium text-center">Ordre</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-admin-border last:border-0">
              <td className="px-4 py-3">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-10 w-10 rounded-lg border border-admin-border object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg border border-admin-border bg-admin-bg" />
                )}
              </td>
              <td className="px-4 py-3 font-medium text-surface-0">{cat.name}</td>
              <td className="px-4 py-3 text-text-muted">{cat.description}</td>
              <td className="px-4 py-3 text-text-muted">{cat.badge || "—"}</td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    cat.visible_on_landing ? "bg-admin-success" : "bg-admin-border"
                  }`}
                />
              </td>
              <td className="px-4 py-3 text-center text-text-muted">{cat.sort_order}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="rounded-lg p-1.5 text-text-muted hover:bg-admin-bg hover:text-surface-0 transition-colors"
                  >
                    <PencilSimple size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                    className="rounded-lg p-1.5 text-text-muted hover:bg-admin-warning/10 hover:text-admin-warning transition-colors disabled:opacity-50"
                  >
                    <TrashSimple size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                Aucune categorie
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
