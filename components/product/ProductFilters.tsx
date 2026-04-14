"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories?: Category[];
}

export function ProductFilters({ categories = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const filterItems = [
    { value: "", label: "Tous" },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ];

  function handleCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filterItems.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategory(cat.value)}
          className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors duration-200 cursor-pointer ${
            activeCategory === cat.value
              ? "bg-accent text-surface-0"
              : "bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text-primary"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
