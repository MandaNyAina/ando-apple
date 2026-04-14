"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { CTAContent } from "@/lib/types";

interface CTASectionProps {
  content: CTAContent;
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Radial gradient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <ScrollReveal className="flex flex-col items-center text-center gap-6">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
            {content.title}
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-lg">
            {content.subtitle}
          </p>
          <Link href="/products" className="mt-4">
            <Button variant="solid">{content.button_text}</Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
