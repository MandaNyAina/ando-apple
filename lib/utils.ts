export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const DEFAULT_CURRENCY = "Ar";

export function formatPrice(price: number, currency?: string): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency !== undefined ? `${formatted} ${currency}` : formatted;
}

export function calculateSavings(
  price: number,
  originalPrice: number | null,
): { amount: number; percentage: number } | null {
  if (!originalPrice || originalPrice <= price) return null;
  const amount = originalPrice - price;
  const percentage = Math.round((amount / originalPrice) * 100);
  return { amount, percentage };
}

export const CONDITION_LABELS: Record<string, string> = {
  pristine: "Grade A+ — Pristine",
  excellent: "Grade A — Excellent",
  good: "Grade B — Bon état",
};
