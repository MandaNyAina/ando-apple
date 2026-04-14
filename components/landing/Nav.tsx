"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, List, X } from "@phosphor-icons/react";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface NavProps {
  logoUrl?: string;
  categories?: Category[];
}

export function Nav({ logoUrl, categories }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/products", label: "Produits" },
    ...(categories ?? []).map((cat) => ({
      href: `/products?category=${cat.slug}`,
      label: cat.name,
    })),
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-40 border-b border-[rgba(138,158,150,0.04)] transition-colors duration-300"
        style={{
          background: scrolled ? "rgba(17,22,20,0.92)" : "rgba(17,22,20,0.6)",
          backdropFilter: "blur(40px) saturate(1.4)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
            <img
              src={logoUrl || "/logo.jpg"}
              alt="ASE TECH"
              className="h-7 md:h-8 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body font-medium text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200 hidden md:flex">
              <MagnifyingGlass size={20} />
            </button>

            {/* Mobile burger */}
            <button
              className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-surface-0/98 backdrop-blur-xl pt-20 px-6 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-headline text-2xl font-bold text-text-primary py-3 border-b border-[rgba(138,158,150,0.06)] hover:text-accent-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
