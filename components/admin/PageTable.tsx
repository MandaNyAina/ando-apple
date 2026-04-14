"use client";

import Link from "next/link";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { Page } from "@/lib/types";
import { deletePage } from "@/lib/actions/pages";

interface PageTableProps {
  pages: Page[];
}

export function PageTable({ pages }: PageTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Etes-vous sur de vouloir supprimer cette page ?")) {
      await deletePage(id);
    }
  };

  if (pages.length === 0) {
    return (
      <div className="rounded-xl border border-admin-border bg-admin-card p-12 text-center">
        <p className="text-text-muted">Aucune page pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-admin-border">
            <th className="px-4 py-3 font-medium text-text-muted">Titre</th>
            <th className="px-4 py-3 font-medium text-text-muted">Slug</th>
            <th className="px-4 py-3 font-medium text-text-muted">Publiee</th>
            <th className="px-4 py-3 font-medium text-text-muted">Footer</th>
            <th className="px-4 py-3 font-medium text-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id} className="border-b border-admin-border last:border-b-0">
              <td className="px-4 py-3 font-medium text-surface-0">{page.title}</td>
              <td className="px-4 py-3 text-text-muted">/{page.slug}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    page.published
                      ? "bg-admin-success/10 text-admin-success"
                      : "bg-admin-warning/10 text-admin-warning"
                  }`}
                >
                  {page.published ? "Oui" : "Non"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    page.show_in_footer
                      ? "bg-admin-success/10 text-admin-success"
                      : "bg-admin-warning/10 text-admin-warning"
                  }`}
                >
                  {page.show_in_footer ? "Oui" : "Non"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-admin-bg hover:text-admin-success"
                  >
                    <PencilSimple size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
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
