"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Tag,
  Star,
  Headset,
  MagnifyingGlass,
  CurrencyCircleDollar,
  Recycle,
  Certificate,
  Heart,
  Lightning,
  CheckCircle,
  Handshake,
  Trophy,
  Leaf,
  Lock,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { ValuesContent } from "@/lib/types";

interface TrustValuesProps {
  content: ValuesContent;
}

const ICON_MAP: Record<string, PhosphorIcon> = {
  ShieldCheck,
  Tag,
  Star,
  Headset,
  MagnifyingGlass,
  CurrencyCircleDollar,
  Recycle,
  Certificate,
  Heart,
  Lightning,
  CheckCircle,
  Handshake,
  Trophy,
  Leaf,
  Lock,
};

function getPhosphorIcon(iconName: string): PhosphorIcon {
  return ICON_MAP[iconName] ?? Star;
}

export function TrustValues({ content }: TrustValuesProps) {
  if (!content.items || content.items.length === 0) return null;

  return (
    <section id="values" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-16 text-center">
            Pourquoi nous choisir
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-16 md:gap-24">
          {content.items.map((item, i) => {
            const Icon = getPhosphorIcon(item.icon);
            const isReversed = i % 2 !== 0;
            const number = String(i + 1).padStart(2, "0");

            return (
              <ScrollReveal key={`value-${item.title}-${i}`} delay={i * 0.1}>
                <div
                  className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
                >
                  {/* Text side */}
                  <div className="flex-1 flex flex-col gap-4">
                    <span className="font-headline text-5xl md:text-8xl font-extrabold text-surface-3">
                      {number}
                    </span>
                    <div className="flex items-center gap-3">
                      <Icon size={24} weight="fill" className="text-accent" />
                      <h3 className="font-headline text-xl md:text-2xl font-bold text-text-primary">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-base leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>

                  {/* Image side */}
                  <div className="flex-1 w-full">
                    <div className="relative aspect-[4/3] rounded-[16px] bg-surface-1 border border-[rgba(138,158,150,0.06)] overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon size={64} weight="thin" className="text-surface-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
