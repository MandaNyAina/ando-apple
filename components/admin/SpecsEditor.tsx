"use client";

import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

interface SpecsEditorProps {
  specs: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
}

export function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
  const entries = Object.entries(specs);

  const addRow = () => {
    onChange({ ...specs, "": "" });
  };

  const updateKey = (oldKey: string, newKey: string, index: number) => {
    const newSpecs: Record<string, string> = {};
    entries.forEach(([k, v], i) => {
      if (i === index) {
        newSpecs[newKey] = v;
      } else {
        newSpecs[k] = v;
      }
    });
    onChange(newSpecs);
  };

  const updateValue = (key: string, value: string, index: number) => {
    const newSpecs: Record<string, string> = {};
    entries.forEach(([k, v], i) => {
      if (i === index) {
        newSpecs[k] = value;
      } else {
        newSpecs[k] = v;
      }
    });
    onChange(newSpecs);
  };

  const removeRow = (index: number) => {
    const newSpecs: Record<string, string> = {};
    entries.forEach(([k, v], i) => {
      if (i !== index) {
        newSpecs[k] = v;
      }
    });
    onChange(newSpecs);
  };

  return (
    <div className="space-y-3">
      {entries.map(([key, value], index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="text"
            value={key}
            onChange={(e) => updateKey(key, e.target.value, index)}
            placeholder="Cle (ex: Stockage)"
            className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => updateValue(key, e.target.value, index)}
            placeholder="Valeur (ex: 256 Go)"
            className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-surface-0 placeholder:text-text-muted focus:border-admin-success focus:outline-none"
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="rounded-lg p-2 text-admin-warning transition-colors hover:bg-admin-warning/10"
          >
            <TrashIcon size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 rounded-lg border border-dashed border-admin-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-admin-success hover:text-admin-success"
      >
        <PlusIcon size={16} />
        Ajouter une specification
      </button>
    </div>
  );
}
