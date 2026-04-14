"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS, formatPrice } from "@/lib/utils";
import type { HeroContent, Product } from "@/lib/types";

interface HeroProps {
  content: HeroContent;
  featuredProduct: Product | null;
}

export function Hero({ content, featuredProduct }: HeroProps) {
  const titleParts = content.title.split(".");
  const titleMain = titleParts[0] + ".";
  const titleAccent = titleParts[1] ?? "";

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center pt-28 pb-16">
        {/* Left — Text */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <span className="inline-block w-fit px-3 py-1.5 rounded-[8px] bg-accent/10 border border-accent/[0.08] text-[11px] font-semibold text-accent-light uppercase tracking-widest">
            Reconditionné premium
          </span>
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            {titleMain}
            {titleAccent && (
              <span className="text-accent">{titleAccent}</span>
            )}
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-lg leading-relaxed">
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/products">
              <Button variant="solid">{content.cta_primary}</Button>
            </Link>
            <Link href="#values">
              <Button variant="outline">{content.cta_secondary}</Button>
            </Link>
          </div>
        </motion.div>

        {/* Right — Showcase card */}
        {featuredProduct && (
          <motion.div
            className="relative w-full max-w-[380px] mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          >
            <div className="rounded-[20px] bg-surface-1 border border-[rgba(138,158,150,0.06)] p-5 flex flex-col gap-4">
              <div className="relative aspect-square rounded-[14px] bg-surface-2 overflow-hidden">
                {featuredProduct.images[0] && (
                  <Image
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-accent-muted uppercase tracking-wider">
                  {CONDITION_LABELS[featuredProduct.condition] ?? featuredProduct.condition}
                </span>
                <h3 className="font-headline text-lg font-bold text-text-primary">
                  {featuredProduct.name}
                </h3>
                <span className="font-body text-xl font-bold text-accent-light">
                  {formatPrice(featuredProduct.price)} Ar
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
