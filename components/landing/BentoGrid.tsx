"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { Category } from "@/lib/types";

interface BentoGridProps {
  categories?: Category[];
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
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] grid-rows-[auto] md:grid-rows-2 gap-4">
            {items.map((cat, i) => {
              const isFirst = i === 0;
              const isSecond = i === 1;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className={`${isFirst ? "md:row-span-2" : ""} ${isSecond ? "md:col-span-2" : ""}`}
                >
                  <motion.div
                    className="relative w-full h-full min-h-[200px] md:min-h-[240px] rounded-[16px] bg-surface-1 border border-[rgba(138,158,150,0.06)] overflow-hidden group"
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
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
