"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS, formatPrice } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react";
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
      {/* Background visual treatment */}
      {content.background_image ? (
        <div className="absolute inset-0">
          <Image src={content.background_image} alt="" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-0/80 via-surface-0/60 to-surface-0" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-accent/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-[80px]" />
          <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-[rgba(138,158,150,0.03)] blur-[60px]" />
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-20 items-center pt-24 md:pt-28 pb-12 md:pb-16 relative z-10">
        {/* Left — Text */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
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
        <motion.div
          className="relative w-full max-w-[300px] lg:max-w-[380px] mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
        >
          {featuredProduct ? (
            <Link href={`/products/${featuredProduct.slug}`} className="block group">
              <div className="rounded-[20px] bg-surface-1 border border-[rgba(138,158,150,0.06)] group-hover:border-accent/20 p-5 flex flex-col gap-4 transition-colors duration-300">
                <div className="relative aspect-square rounded-[14px] bg-surface-2 overflow-hidden">
                  {featuredProduct.images[0] && (
                    <Image
                      src={featuredProduct.images[0]}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xl font-bold text-accent-light">
                      {formatPrice(featuredProduct.price)} Ar
                    </span>
                    <ArrowRight size={18} className="text-text-muted group-hover:text-accent-light transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-[20px] bg-surface-1 border border-[rgba(138,158,150,0.06)] p-8 flex flex-col items-center justify-center gap-4 aspect-square">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-accent">A</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-text-primary text-center">
                Qualité premium
              </h3>
              <p className="text-text-secondary text-sm text-center max-w-[260px]">
                Des produits Apple reconditionnés avec soin, testés et garantis.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
