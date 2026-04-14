import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: totalCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: inStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("in_stock", true);

  const total = totalCount ?? 0;
  const inStock = inStockCount ?? 0;
  const outOfStock = total - inStock;

  const stats = [
    { label: "Total produits", value: total, color: "text-surface-0" },
    { label: "En stock", value: inStock, color: "text-admin-success" },
    { label: "Rupture", value: outOfStock, color: "text-admin-warning" },
  ];

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-surface-0">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Vue d&apos;ensemble de votre catalogue</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-admin-border bg-admin-card p-6">
            <p className="text-sm font-medium text-text-muted">{label}</p>
            <p className={`mt-2 font-headline text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
