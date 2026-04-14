"use client";

import { useState, useEffect } from "react";
import { FloppyDisk } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "@/lib/actions/settings";

const SETTING_KEYS = [
  { key: "whatsapp_number", label: "Numero WhatsApp", placeholder: "+261 34 00 000 00" },
  { key: "email", label: "Email", placeholder: "contact@asetech.mg" },
  { key: "phone", label: "Telephone", placeholder: "+261 34 00 000 00" },
  { key: "site_title", label: "Titre du site", placeholder: "ASE TECH" },
  {
    key: "site_description",
    label: "Description du site",
    placeholder: "Produits Apple reconditionnes a Madagascar",
  },
  { key: "currency", label: "Devise", placeholder: "Ar" },
  { key: "logo_url", label: "URL du logo", placeholder: "https://... ou /logo.jpg" },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((row: { key: string; value: string }) => {
        map[row.key] = row.value;
      });
      setValues(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const entries = SETTING_KEYS.map(({ key }) => ({
        key,
        value: values[key] || "",
      }));
      await updateSettings(entries);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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

  if (loading) {
    return (
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-text-muted">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">
        Paramètres
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Configurez les informations générales de votre site
      </p>

      <div className="mt-8 rounded-[14px] border border-admin-border bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SETTING_KEYS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={inputClass}
                placeholder={placeholder}
                value={values[key] || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[14px] bg-admin-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-admin-success/90 disabled:opacity-50"
          >
            <FloppyDisk size={18} weight="bold" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-admin-success">
              Sauvegardé avec succès !
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
