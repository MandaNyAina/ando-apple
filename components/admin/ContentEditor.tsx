"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { updateSiteContent } from "@/lib/actions/content";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
  GalleryContent,
  GalleryItem,
  MarqueeContent,
  Product,
  TestimonialItem,
  ValueItem,
} from "@/lib/types";

interface ContentEditorProps {
  hero: HeroContent;
  featuredProduct: FeaturedProductContent;
  values: ValuesContent;
  testimonials: TestimonialsContent;
  cta: CTAContent;
  gallery: GalleryContent;
  marquee: MarqueeContent;
  products: Product[];
}

export function ContentEditor({
  hero: initialHero,
  featuredProduct: initialFeatured,
  values: initialValues,
  testimonials: initialTestimonials,
  cta: initialCta,
  gallery: initialGallery,
  marquee: initialMarquee,
  products,
}: ContentEditorProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [featuredProduct, setFeaturedProduct] = useState<FeaturedProductContent>(initialFeatured);
  const [values, setValues] = useState<ValuesContent>(initialValues);
  const [testimonials, setTestimonials] = useState<TestimonialsContent>(initialTestimonials);
  const [cta, setCta] = useState<CTAContent>(initialCta);
  const [gallery, setGallery] = useState<GalleryContent>(initialGallery);
  const [marquee, setMarquee] = useState<MarqueeContent>(initialMarquee);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const newId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const [valueKeys, setValueKeys] = useState<string[]>(() => initialValues.items.map(newId));
  const [marqueeKeys, setMarqueeKeys] = useState<string[]>(() => initialMarquee.items.map(newId));
  const [testimonialKeys, setTestimonialKeys] = useState<string[]>(() =>
    initialTestimonials.items.map(newId),
  );
  const [galleryKeys, setGalleryKeys] = useState<string[]>(() => initialGallery.items.map(newId));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    const sections: { name: string; payload: Record<string, unknown> }[] = [
      { name: "hero", payload: hero as unknown as Record<string, unknown> },
      {
        name: "featured_product",
        payload: featuredProduct as unknown as Record<string, unknown>,
      },
      { name: "values", payload: values as unknown as Record<string, unknown> },
      { name: "testimonials", payload: testimonials as unknown as Record<string, unknown> },
      { name: "cta", payload: cta as unknown as Record<string, unknown> },
      { name: "gallery", payload: gallery as unknown as Record<string, unknown> },
      { name: "marquee", payload: marquee as unknown as Record<string, unknown> },
    ];

    const results = await Promise.allSettled(
      sections.map((s) => updateSiteContent(s.name, s.payload)),
    );
    const failed = results
      .map((r, i) => ({ result: r, name: sections[i].name }))
      .filter((x) => x.result.status === "rejected")
      .map((x) => x.name);

    if (failed.length === 0) {
      setSaved(true);
    } else {
      setSaveError(`Échec de la sauvegarde pour : ${failed.join(", ")}`);
    }
    setSaving(false);
  };

  const updateValue = (index: number, field: keyof ValueItem, val: string) => {
    setValues((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { items: updated };
    });
  };

  const addValue = () => {
    setValues((prev) => ({
      items: [
        ...prev.items,
        { title: "", description: "", icon: "ShieldCheck", image: "" },
      ],
    }));
    setValueKeys((prev) => [...prev, newId()]);
  };

  const removeValue = (index: number) => {
    setValues((prev) => ({ items: prev.items.filter((_, i) => i !== index) }));
    setValueKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const addMarqueeItem = () => {
    setMarquee((prev) => ({ items: [...prev.items, ""] }));
    setMarqueeKeys((prev) => [...prev, newId()]);
  };

  const removeMarqueeItem = (index: number) => {
    setMarquee((prev) => ({ items: prev.items.filter((_, i) => i !== index) }));
    setMarqueeKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMarqueeItem = (index: number, val: string) => {
    setMarquee((prev) => {
      const updated = [...prev.items];
      updated[index] = val;
      return { items: updated };
    });
  };

  const addTestimonial = () => {
    setTestimonials((prev) => ({
      items: [...prev.items, { name: "", role: "", rating: 5, comment: "" }],
    }));
    setTestimonialKeys((prev) => [...prev, newId()]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonials((prev) => ({
      items: prev.items.filter((_, i) => i !== index),
    }));
    setTestimonialKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTestimonial = (index: number, field: keyof TestimonialItem, val: string | number) => {
    setTestimonials((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { items: updated };
    });
  };

  const addGalleryItem = () => {
    setGallery((prev) => ({
      items: [...prev.items, { image: "", product_id: "" }],
    }));
    setGalleryKeys((prev) => [...prev, newId()]);
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => ({
      items: prev.items.filter((_, i) => i !== index),
    }));
    setGalleryKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, val: string) => {
    setGallery((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { items: updated };
    });
  };

  const inputClass =
    "w-full rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm text-surface-0 outline-none focus:border-admin-success focus:ring-1 focus:ring-admin-success";
  const labelClass = "block text-sm font-medium text-surface-0 mb-1.5";
  const cardClass = "rounded-[14px] border border-admin-border bg-white p-6";

  return (
    <div className="space-y-8">
      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">Hero</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Badge (au-dessus du titre)</label>
            <input
              className={inputClass}
              placeholder="Reconditionné premium"
              value={hero.badge ?? ""}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
            />
            <p className="mt-1 text-xs text-text-muted">
              Laisser vide pour masquer le badge.
            </p>
          </div>
          <div>
            <label className={labelClass}>Titre</label>
            <input
              className={inputClass}
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <input
              className={inputClass}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>CTA Principal</label>
            <input
              className={inputClass}
              value={hero.cta_primary}
              onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>CTA Secondaire</label>
            <input
              className={inputClass}
              value={hero.cta_secondary}
              onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Produit du Hero</label>
            <select
              className={inputClass}
              value={hero.hero_product_id || ""}
              onChange={(e) => setHero({ ...hero, hero_product_id: e.target.value })}
            >
              <option value="">Automatique (dernier mis en avant)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price} Ar
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Image de fond</label>
            <ImageUploader
              images={hero.background_image ? [hero.background_image] : []}
              onChange={(imgs) => setHero({ ...hero, background_image: imgs[0] || "" })}
              bucket="site-assets"
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">Produit en vedette</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Produit</label>
            <select
              className={inputClass}
              value={featuredProduct.product_id}
              onChange={(e) =>
                setFeaturedProduct({
                  ...featuredProduct,
                  product_id: e.target.value,
                })
              }
            >
              <option value="">Sélectionner un produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Label</label>
            <input
              className={inputClass}
              value={featuredProduct.label}
              onChange={(e) =>
                setFeaturedProduct({
                  ...featuredProduct,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <input
              className={inputClass}
              value={featuredProduct.subtitle}
              onChange={(e) =>
                setFeaturedProduct({
                  ...featuredProduct,
                  subtitle: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-surface-0">Nos services</h2>
          <button
            type="button"
            onClick={addValue}
            className="inline-flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-success/90"
          >
            <PlusIcon size={16} weight="bold" />
            Ajouter un service
          </button>
        </div>
        <div className="space-y-6">
          {values.items.map((item, index) => (
            <div
              key={valueKeys[index] ?? `value-${index}`}
              className="rounded-lg border border-admin-border bg-admin-bg p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-muted">Service {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeValue(index)}
                  aria-label={`Supprimer le service ${index + 1}`}
                  className="rounded-lg p-1.5 text-admin-warning transition-colors hover:bg-admin-warning/10"
                >
                  <TrashIcon size={18} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Titre</label>
                  <input
                    className={inputClass}
                    value={item.title}
                    onChange={(e) => updateValue(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(e) => updateValue(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Icône</label>
                  <IconPicker
                    value={item.icon}
                    onChange={(name) => updateValue(index, "icon", name)}
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Utilisée si aucune image n&apos;est fournie ci-dessous.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Image (remplace l&apos;icône)</label>
                  <ImageUploader
                    images={item.image ? [item.image] : []}
                    onChange={(imgs) => updateValue(index, "image", imgs[0] || "")}
                    bucket="site-assets"
                  />
                </div>
              </div>
            </div>
          ))}
          {values.items.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              Aucun service. Cliquez sur &quot;Ajouter un service&quot; pour commencer.
            </p>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg font-bold text-surface-0">Barre déroulante</h2>
            <p className="text-xs text-text-muted">
              Texte qui défile sous le hero. Ajoutez ou retirez des éléments librement.
            </p>
          </div>
          <button
            type="button"
            onClick={addMarqueeItem}
            className="inline-flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-success/90"
          >
            <PlusIcon size={16} weight="bold" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {marquee.items.map((item, index) => (
            <div
              key={marqueeKeys[index] ?? `marquee-${index}`}
              className="flex items-center gap-3 rounded-lg border border-admin-border bg-admin-bg p-3"
            >
              <input
                className={inputClass}
                value={item}
                placeholder="Garantie 24 mois"
                onChange={(e) => updateMarqueeItem(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMarqueeItem(index)}
                aria-label={`Supprimer l'élément ${index + 1}`}
                className="rounded-lg p-1.5 text-admin-warning transition-colors hover:bg-admin-warning/10"
              >
                <TrashIcon size={18} weight="bold" />
              </button>
            </div>
          ))}
          {marquee.items.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              Aucun élément. Cliquez sur &quot;Ajouter&quot; pour commencer.
            </p>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-surface-0">Témoignages</h2>
          <button
            type="button"
            onClick={addTestimonial}
            className="inline-flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-success/90"
          >
            <PlusIcon size={16} weight="bold" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {testimonials.items.map((item, index) => (
            <div
              key={testimonialKeys[index] ?? `testimonial-${index}`}
              className="rounded-lg border border-admin-border bg-admin-bg p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-muted">Témoignage {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="rounded-lg p-1.5 text-admin-warning transition-colors hover:bg-admin-warning/10"
                >
                  <TrashIcon size={18} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelClass}>Nom</label>
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    className={inputClass}
                    value={item.role}
                    onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={inputClass}
                    value={item.rating}
                    onChange={(e) =>
                      updateTestimonial(index, "rating", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Commentaire</label>
                  <input
                    className={inputClass}
                    value={item.comment}
                    onChange={(e) => updateTestimonial(index, "comment", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          {testimonials.items.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              Aucun témoignage. Cliquez sur &quot;Ajouter&quot; pour en créer un.
            </p>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-surface-0">Galerie d&apos;images</h2>
          <button
            type="button"
            onClick={addGalleryItem}
            className="inline-flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-success/90"
          >
            <PlusIcon size={16} weight="bold" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {gallery.items.map((item, index) => (
            <div
              key={galleryKeys[index] ?? `gallery-${index}`}
              className="rounded-lg border border-admin-border bg-admin-bg p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-muted">Image {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="rounded-lg p-1.5 text-admin-warning transition-colors hover:bg-admin-warning/10"
                >
                  <TrashIcon size={18} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Image</label>
                  <ImageUploader
                    images={item.image ? [item.image] : []}
                    onChange={(imgs) => updateGalleryItem(index, "image", imgs[0] || "")}
                    bucket="site-assets"
                  />
                </div>
                <div>
                  <label className={labelClass}>Lien produit (optionnel)</label>
                  <select
                    className={inputClass}
                    value={item.product_id}
                    onChange={(e) => updateGalleryItem(index, "product_id", e.target.value)}
                  >
                    <option value="">Aucun lien</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          {gallery.items.length === 0 && (
            <p className="py-8 text-center text-sm text-text-muted">
              Aucune image. Cliquez sur &quot;Ajouter&quot; pour en ajouter une.
            </p>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">Call to Action</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Titre</label>
            <input
              className={inputClass}
              value={cta.title}
              onChange={(e) => setCta({ ...cta, title: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Sous-titre</label>
            <input
              className={inputClass}
              value={cta.subtitle}
              onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Texte du bouton</label>
            <input
              className={inputClass}
              value={cta.button_text}
              onChange={(e) => setCta({ ...cta, button_text: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[14px] bg-admin-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90 disabled:opacity-50"
        >
          <FloppyDiskIcon size={18} weight="bold" />
          {saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-admin-success">Sauvegardé avec succès !</span>
        )}
        {saveError && (
          <span className="text-sm font-medium text-admin-warning">{saveError}</span>
        )}
      </div>
    </div>
  );
}
