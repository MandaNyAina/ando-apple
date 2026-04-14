import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const CONDITION_LABELS: Record<string, string> = {
  pristine: "Grade A+ — Pristine",
  excellent: "Grade A — Excellent",
  good: "Grade B — Bon état",
};

interface BadgeProps { condition: string; }

export function Badge({ condition }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent/10 border border-accent/[0.08] text-[11px] font-semibold text-accent-light">
      <ShieldCheck size={14} weight="fill" />
      {CONDITION_LABELS[condition] ?? condition}
    </span>
  );
}
