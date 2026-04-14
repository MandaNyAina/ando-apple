"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, ListIcon, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface NavProps {
  logoUrl?: string;
  categories?: Category[];
}

export function Nav({ logoUrl, categories }: NavProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else if (mobileOpen) setMobileOpen(false);
      }
    },
    [mobileOpen, searchOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

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
        aria-label="Navigation principale"
        className="fixed top-0 w-full z-40 border-b border-accent/[0.04] transition-colors duration-300"
        style={{
          background: scrolled ? "rgba(17,22,20,0.92)" : "rgba(17,22,20,0.6)",
          backdropFilter: "blur(40px) saturate(1.4)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
            <Image
              src={logoUrl || "/logo.jpg"}
              alt="ASE TECH"
              width={120}
              height={32}
              className="h-7 md:h-8 w-auto brightness-0 invert"
            />
          </Link>

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
            <button
              aria-label="Rechercher"
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200"
            >
              <MagnifyingGlassIcon size={20} />
            </button>

            <button
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <ListIcon size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Recherche"
            className="fixed inset-0 z-50 flex items-start justify-center bg-surface-0/95 backdrop-blur-xl pt-28 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <div className="w-full max-w-[600px]">
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon
                  size={22}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full rounded-[14px] border border-accent/[0.12] bg-surface-1 pl-14 pr-12 py-4 text-lg text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Fermer la recherche"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-text-muted">
                Appuyez sur Entrer pour rechercher
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
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
                  className="font-headline text-2xl font-bold text-text-primary py-3 border-b border-accent/[0.06] hover:text-accent-light transition-colors"
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
