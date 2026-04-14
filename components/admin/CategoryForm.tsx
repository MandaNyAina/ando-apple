"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloppyDisk } from "@phosphor-icons/react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";

interface CategoryFormProps {
  category?: Category;
}

function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [badge, setBadge] = useState(category?.badge ?? "");
  const [visibleOnLanding, setVisibleOnLanding] = useState(
    category?.visible_on_landing ?? true
  );
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const input = {
        name,
        slug,
        image,
        description,
        badge,
        visible_on_landing: visibleOnLanding,
        sort_order: sortOrder,
      };

      if (category) {
        await updateCategory(category.id, input);
      } else {
        await createCategory(input);
      }

      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm text-surface-0 outline-none focus:border-admin-success focus:ring-1 focus:ring-admin-success";
  const labelClass = "block text-sm font-medium text-surface-0 mb-1.5";

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-[14px] border border-admin-border bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nom</label>
            <input
              className={inputClass}
              placeholder="iPhone"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              className={inputClass}
              placeholder="iPhone"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input
              className={inputClass}
              placeholder="Du 12 au 15 Pro Max"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Badge</label>
            <input
              className={inputClass}
              placeholder="Grade A+"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Ordre de tri</label>
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="visible_on_landing"
              checked={visibleOnLanding}
              onChange={(e) => setVisibleOnLanding(e.target.checked)}
              className="h-4 w-4 rounded border-admin-border text-admin-success focus:ring-admin-success"
            />
            <label htmlFor="visible_on_landing" className="text-sm font-medium text-surface-0">
              Visible sur la page d&apos;accueil
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass}>Image</label>
          <ImageUploader
            images={image ? [image] : []}
            onChange={(imgs) => setImage(imgs[0] ?? "")}
            bucket="site-assets"
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[14px] bg-admin-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90 disabled:opacity-50"
          >
            <FloppyDisk size={18} weight="bold" />
            {saving ? "Enregistrement..." : category ? "Mettre a jour" : "Creer"}
          </button>
        </div>
      </div>
    </form>
  );
}
