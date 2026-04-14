"use client";

import { useState, useEffect } from "react";
import type { Page } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

interface PageFormProps {
  page?: Page;
  action: (formData: FormData) => Promise<void>;
}

export function PageForm({ page, action }: PageFormProps) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!page);

  useEffect(() => {
    if (!slugManual) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  return (
    <form action={action} className="space-y-8">
      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Informations generales
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Titre
            </label>
            <input
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="Politique de confidentialite"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Slug
            </label>
            <input
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="politique-de-confidentialite"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Contenu (HTML)
            </label>
            <textarea
              name="content"
              rows={12}
              defaultValue={page?.content ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none font-mono"
              placeholder="<h2>Titre de section</h2><p>Contenu de la page...</p>"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          SEO
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Meta titre
            </label>
            <input
              name="meta_title"
              type="text"
              defaultValue={page?.meta_title ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="Titre pour les moteurs de recherche"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Meta description
            </label>
            <textarea
              name="meta_description"
              rows={3}
              defaultValue={page?.meta_description ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="Description pour les moteurs de recherche"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Call to Action (optionnel)
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Texte du bouton
            </label>
            <input
              name="cta_text"
              type="text"
              defaultValue={page?.cta_text ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="Nous contacter"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Lien du bouton
            </label>
            <input
              name="cta_link"
              type="text"
              defaultValue={page?.cta_link ?? ""}
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
              placeholder="https://wa.me/261340000000"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h2 className="mb-4 font-headline text-lg font-semibold text-surface-0">
          Options
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Publiee
            </label>
            <select
              name="published"
              defaultValue={
                page ? (page.published ? "true" : "false") : "true"
              }
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Afficher dans le footer
            </label>
            <select
              name="show_in_footer"
              defaultValue={
                page ? (page.show_in_footer ? "true" : "false") : "true"
              }
              className="w-full rounded-lg border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-surface-0 focus:border-admin-success focus:outline-none"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-admin-success px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90"
        >
          {page ? "Mettre a jour" : "Creer la page"}
        </button>
      </div>
    </form>
  );
}
