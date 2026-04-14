"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "Tous" },
  { value: "iPhone", label: "iPhone" },
  { value: "MacBook", label: "MacBook" },
  { value: "iPad", label: "iPad" },
  { value: "Watch", label: "Watch" },
  { value: "AirPods", label: "AirPods" },
  { value: "Accessories", label: "Accessoires" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

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
      {CATEGORIES.map((cat) => (
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
