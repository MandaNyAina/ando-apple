"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { Category } from "@/lib/types";

interface BentoGridProps {
  categories?: Category[];
}

interface BentoItem {
  title: string;
  image: string;
  href: string;
  description: string;
  badge: string;
}

function BentoCard({
  cat,
  className = "",
}: {
  cat: BentoItem;
  className?: string;
}) {
  return (
    <Link href={cat.href} className={className}>
      <motion.div
        className="relative w-full h-full min-h-[220px] rounded-[16px] bg-surface-1 border border-[rgba(138,158,150,0.06)] overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <img
          src={cat.image}
          alt={cat.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-0/80 via-surface-0/20 to-transparent" />
        <div className="absolute bottom-4 left-5">
          {cat.badge && (
            <span className="inline-block mb-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-semibold text-accent-light">
              {cat.badge}
            </span>
          )}
          <h3 className="font-headline text-xl font-bold text-text-primary">
            {cat.title}
          </h3>
          {cat.description && (
            <p className="text-xs text-text-muted mt-0.5">{cat.description}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

/**
 * Builds rows from items following a repeating bento pattern:
 *
 * Row pattern cycles through groups:
 * - Group of 4: 1 big (spans 2 rows) + 1 wide (spans 2 cols) + 2 small
 * - Remaining 3: 1 big (spans 2 rows) + 2 small
 * - Remaining 2: 2 equal side by side
 * - Remaining 1: full width
 */
function renderBentoLayout(items: BentoItem[]) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <BentoCard cat={items[0]} />
      </div>
    );
  }

  if (items.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((cat) => (
          <BentoCard key={cat.title} cat={cat} />
        ))}
      </div>
    );
  }

  if (items.length === 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] md:grid-rows-2 gap-4">
        <BentoCard cat={items[0]} className="md:row-span-2" />
        <BentoCard cat={items[1]} />
        <BentoCard cat={items[2]} />
      </div>
    );
  }

  // 4+ items: process in chunks
  const rows: React.ReactNode[] = [];
  let i = 0;
  let groupIndex = 0;

  while (i < items.length) {
    const remaining = items.length - i;

    if (remaining >= 4) {
      // Group of 4: big left (2 rows) + wide top-right (2 cols) + 2 small bottom
      rows.push(
        <div
          key={`group-${groupIndex}`}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2 gap-4"
        >
          <BentoCard cat={items[i]} className="md:row-span-2" />
          <BentoCard cat={items[i + 1]} className="md:col-span-2" />
          <BentoCard cat={items[i + 2]} />
          <BentoCard cat={items[i + 3]} />
        </div>
      );
      i += 4;
    } else if (remaining === 3) {
      // 3 remaining: big left + 2 small right
      rows.push(
        <div
          key={`group-${groupIndex}`}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr] md:grid-rows-2 gap-4"
        >
          <BentoCard cat={items[i]} className="md:row-span-2" />
          <BentoCard cat={items[i + 1]} />
          <BentoCard cat={items[i + 2]} />
        </div>
      );
      i += 3;
    } else if (remaining === 2) {
      // 2 remaining: side by side
      rows.push(
        <div
          key={`group-${groupIndex}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <BentoCard cat={items[i]} />
          <BentoCard cat={items[i + 1]} />
        </div>
      );
      i += 2;
    } else {
      // 1 remaining: full width
      rows.push(
        <div key={`group-${groupIndex}`} className="grid grid-cols-1 gap-4">
          <BentoCard cat={items[i]} />
        </div>
      );
      i += 1;
    }
    groupIndex++;
  }

  return <div className="space-y-4">{rows}</div>;
}

export function BentoGrid({ categories = [] }: BentoGridProps) {
  const items = categories
    .filter((cat) => cat.visible_on_landing)
    .map((cat) => ({
      title: cat.name,
      image: cat.image || `https://picsum.photos/seed/${cat.slug}/800/800`,
      href: `/products?category=${cat.slug}`,
      description: cat.description,
      badge: cat.badge,
    }));

  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-10 text-center">
            Nos categories
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          {renderBentoLayout(items)}
        </ScrollReveal>
      </div>
    </section>
  );
}
