"use client";

import { StarIcon } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { TestimonialsContent } from "@/lib/types";

interface TestimonialsProps {
  content: TestimonialsContent;
}

export function Testimonials({ content }: TestimonialsProps) {
  if (!content.items || content.items.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-surface-1">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ScrollReveal>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-14 text-center">
            Ce que disent nos clients
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.items.map((item, i) => {
            const initials = item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <ScrollReveal key={i} delay={i * 0.08} className={i % 2 !== 0 ? "md:mt-10" : ""}>
                <div className="rounded-[16px] bg-surface-2 border border-accent/[0.06] p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5" aria-label={`Note : ${item.rating} sur 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <StarIcon
                        key={s}
                        size={16}
                        weight={s < item.rating ? "fill" : "regular"}
                        className={s < item.rating ? "text-accent-light" : "text-surface-4"}
                      />
                    ))}
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 mt-auto pt-2">
                    <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-[11px] font-bold text-accent-light">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.role}</p>
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
