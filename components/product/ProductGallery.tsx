"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-[16px] bg-surface-2 flex items-center justify-center text-text-muted">
        Pas d&apos;image disponible
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-[16px] bg-surface-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={images[selected]}
              alt={`${name} — image ${selected + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-pressed={i === selected}
              className={`relative w-20 h-20 flex-shrink-0 rounded-[10px] overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${
                i === selected
                  ? "border-accent"
                  : "border-transparent hover:border-accent/20"
              }`}
            >
              <Image
                src={img}
                alt={`${name} — miniature ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
