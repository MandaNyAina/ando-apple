const TRUST_POINTS = [
  "Garantie 24 mois",
  "Inspection 90 points",
  "Livraison express",
  "Satisfait ou remboursé",
  "Batterie certifiée",
  "Économie circulaire",
  "Support technique dédié",
  "Paiement sécurisé",
];

export function Marquee() {
  const items = [...TRUST_POINTS, ...TRUST_POINTS];

  return (
    <section className="py-6 border-y border-[rgba(138,158,150,0.06)] overflow-hidden bg-surface-1">
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
