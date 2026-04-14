"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { formatPrice } from "@/lib/utils";
import type { FeaturedProductContent, Product } from "@/lib/types";

interface FeaturedProductProps {
  content: FeaturedProductContent;
  product: Product | null;
}

export function FeaturedProduct({ content, product }: FeaturedProductProps) {
  if (!product) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal className="flex flex-col items-center text-center gap-8">
          <span className="px-3 py-1.5 rounded-[8px] bg-accent/10 border border-accent/[0.08] text-[11px] font-semibold text-accent-light uppercase tracking-widest">
            {content.label}
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">
            {product.name}
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-lg">{content.subtitle}</p>

          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-[20px] bg-surface-1 border border-accent/[0.06] overflow-hidden mt-4">
            {product.images[0] && (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            )}
          </div>

          <span className="font-body text-3xl md:text-4xl font-bold text-accent-light">
            {formatPrice(product.price)} Ar
          </span>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/products/${product.slug}`}>
              <Button variant="solid">Voir le produit</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Tous les produits</Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
