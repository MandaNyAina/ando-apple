const DEFAULT_TRUST_POINTS = [
  "Garantie 24 mois",
  "Inspection 90 points",
  "Livraison express",
  "Satisfait ou remboursé",
  "Batterie certifiée",
  "Économie circulaire",
  "Support technique dédié",
  "Paiement sécurisé",
];

interface MarqueeProps {
  items?: string[];
}

export function Marquee({ items: source }: MarqueeProps = {}) {
  const base = source ?? DEFAULT_TRUST_POINTS;
  const points = base.filter((s) => s.trim().length > 0);
  if (points.length === 0) return null;
  const items = [...points, ...points];

  return (
    <section className="py-6 border-y border-accent/[0.06] overflow-hidden bg-surface-1 group-marquee">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-8 font-body text-sm text-text-muted font-medium flex items-center gap-3 shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
