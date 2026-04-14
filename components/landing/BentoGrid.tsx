"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { BentoCategory } from "@/lib/types";

const DEFAULT_CATEGORIES: BentoCategory[] = [
  { title: "iPhone", image: "https://picsum.photos/seed/iphone/800/800", href: "/products?category=iPhone" },
  { title: "MacBook", image: "https://picsum.photos/seed/macbook/800/400", href: "/products?category=MacBook" },
  { title: "iPad", image: "https://picsum.photos/seed/ipad/400/400", href: "/products?category=iPad" },
  { title: "Watch", image: "https://picsum.photos/seed/watch/400/400", href: "/products?category=Watch" },
  { title: "AirPods", image: "https://picsum.photos/seed/airpods/400/400", href: "/products?category=AirPods" },
];

interface BentoGridProps {
  categories?: BentoCategory[];
}

export function BentoGrid({ categories = [] }: BentoGridProps) {
  const items = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-10 text-center">
            Nos catégories
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
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-0/80 via-surface-0/20 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <h3 className="font-headline text-xl font-bold text-text-primary">
                        {cat.title}
                      </h3>
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
