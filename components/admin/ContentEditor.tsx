"use client";

import { useState } from "react";
import { Plus, Trash, FloppyDisk } from "@phosphor-icons/react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateSiteContent } from "@/lib/actions/content";
import type {
  HeroContent,
  FeaturedProductContent,
  ValuesContent,
  TestimonialsContent,
  CTAContent,
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
  products: Product[];
}

export function ContentEditor({
  hero: initialHero,
  featuredProduct: initialFeatured,
  values: initialValues,
  testimonials: initialTestimonials,
  cta: initialCta,
  products,
}: ContentEditorProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedProductContent>(initialFeatured);
  const [values, setValues] = useState<ValuesContent>(initialValues);
  const [testimonials, setTestimonials] =
    useState<TestimonialsContent>(initialTestimonials);
  const [cta, setCta] = useState<CTAContent>(initialCta);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([
        updateSiteContent("hero", hero as unknown as Record<string, unknown>),
        updateSiteContent(
          "featured_product",
          featuredProduct as unknown as Record<string, unknown>
        ),
        updateSiteContent(
          "values",
          values as unknown as Record<string, unknown>
        ),
        updateSiteContent(
          "testimonials",
          testimonials as unknown as Record<string, unknown>
        ),
        updateSiteContent("cta", cta as unknown as Record<string, unknown>),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (index: number, field: keyof ValueItem, val: string) => {
    const updated = [...values.items];
    updated[index] = { ...updated[index], [field]: val };
    setValues({ items: updated });
  };

  const addTestimonial = () => {
    setTestimonials({
      items: [
        ...testimonials.items,
        { name: "", role: "", rating: 5, comment: "" },
      ],
    });
  };

  const removeTestimonial = (index: number) => {
    setTestimonials({
      items: testimonials.items.filter((_, i) => i !== index),
    });
  };

  const updateTestimonial = (
    index: number,
    field: keyof TestimonialItem,
    val: string | number
  ) => {
    const updated = [...testimonials.items];
    updated[index] = { ...updated[index], [field]: val };
    setTestimonials({ items: updated });
  };

  const inputClass =
    "w-full rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm text-surface-0 outline-none focus:border-admin-success focus:ring-1 focus:ring-admin-success";
  const labelClass = "block text-sm font-medium text-surface-0 mb-1.5";
  const cardClass =
    "rounded-[14px] border border-admin-border bg-white p-6";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">
          Hero
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
              onChange={(e) =>
                setHero({ ...hero, cta_primary: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>CTA Secondaire</label>
            <input
              className={inputClass}
              value={hero.cta_secondary}
              onChange={(e) =>
                setHero({ ...hero, cta_secondary: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Image de fond</label>
            <ImageUploader
              images={hero.background_image ? [hero.background_image] : []}
              onChange={(imgs) =>
                setHero({ ...hero, background_image: imgs[0] || "" })
              }
              bucket="site-assets"
            />
          </div>
        </div>
      </div>

      {/* Featured Product Section */}
      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">
          Produit en vedette
        </h2>
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

      {/* Values Section */}
      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">
          Nos valeurs
        </h2>
        <div className="space-y-6">
          {values.items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-admin-border bg-admin-bg p-4"
            >
              <p className="mb-3 text-sm font-semibold text-text-muted">
                Valeur {index + 1}
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Titre</label>
                  <input
                    className={inputClass}
                    value={item.title}
                    onChange={(e) =>
                      updateValue(index, "title", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Icone</label>
                  <input
                    className={inputClass}
                    value={item.icon}
                    onChange={(e) =>
                      updateValue(index, "icon", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(e) =>
                      updateValue(index, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className={cardClass}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-surface-0">
            Témoignages
          </h2>
          <button
            type="button"
            onClick={addTestimonial}
            className="inline-flex items-center gap-2 rounded-lg bg-admin-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-success/90"
          >
            <Plus size={16} weight="bold" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {testimonials.items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-admin-border bg-admin-bg p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-muted">
                  Témoignage {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="rounded-lg p-1.5 text-admin-warning transition-colors hover:bg-admin-warning/10"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelClass}>Nom</label>
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) =>
                      updateTestimonial(index, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    className={inputClass}
                    value={item.role}
                    onChange={(e) =>
                      updateTestimonial(index, "role", e.target.value)
                    }
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
                      updateTestimonial(
                        index,
                        "rating",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Commentaire</label>
                  <input
                    className={inputClass}
                    value={item.comment}
                    onChange={(e) =>
                      updateTestimonial(index, "comment", e.target.value)
                    }
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

      {/* CTA Section */}
      <div className={cardClass}>
        <h2 className="font-headline text-lg font-bold text-surface-0 mb-6">
          Call to Action
        </h2>
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

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[14px] bg-admin-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90 disabled:opacity-50"
        >
          <FloppyDisk size={18} weight="bold" />
          {saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-admin-success">
            Sauvegardé avec succès !
          </span>
        )}
      </div>
    </div>
  );
}
