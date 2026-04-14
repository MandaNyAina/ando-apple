"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  iPhone: "iPhone",
  MacBook: "MacBook",
  iPad: "iPad",
  Watch: "Apple Watch",
  AirPods: "AirPods",
  Accessories: "Accessoires",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <motion.article
        className="group rounded-[16px] bg-surface-1 border border-[rgba(138,158,150,0.06)] overflow-hidden cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="relative aspect-square bg-surface-2 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
              Pas d&apos;image
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>

          <h3 className="font-headline font-semibold text-[15px] text-text-primary leading-tight line-clamp-2">
            {product.name}
          </h3>

          <Badge condition={product.condition} />

          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-headline font-bold text-lg text-text-primary">
              {formatPrice(product.price)} Ar
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[13px] text-text-muted line-through">
                {formatPrice(product.original_price)} Ar
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
