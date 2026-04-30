"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ListIcon,
  CaretDownIcon,
  WhatsappLogoIcon,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface NavProps {
  logoUrl?: string;
  whatsappNumber?: string;
}

const CATALOGUE_ITEMS = [
  { href: "/products?category=MacBook", label: "MacBook" },
  { href: "/products?category=iPad", label: "iPad" },
  { href: "/products?category=Accessories", label: "Accessoires" },
];

function buildWhatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export function Nav({ logoUrl, whatsappNumber }: NavProps) {
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

  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const catalogueRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!catalogueOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (catalogueRef.current && !catalogueRef.current.contains(event.target as Node)) {
        setCatalogueOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCatalogueOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [catalogueOpen]);

  const handleCatalogueBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!catalogueRef.current?.contains(event.relatedTarget as Node | null)) {
      setCatalogueOpen(false);
    }
  };

  const whatsappHref = buildWhatsappHref(whatsappNumber ?? "");

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
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex justify-between items-center md:grid md:grid-cols-3">
          <Link
            href="/"
            className="flex items-center md:justify-self-start"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative h-12 md:h-16 w-[170px] md:w-[208px] brightness-0 invert">
              <Image
                src={logoUrl || "/logo.png"}
                alt="ASE TECH"
                fill
                sizes="(max-width: 768px) 170px, 208px"
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8">
            <Link
              href="/#values"
              className="font-body font-medium text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Nos services
            </Link>

            <div className="relative" ref={catalogueRef} onBlur={handleCatalogueBlur}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={catalogueOpen}
                onClick={() => setCatalogueOpen((v) => !v)}
                className="flex items-center gap-1 font-body font-medium text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Catalogue
                <CaretDownIcon
                  size={12}
                  weight="bold"
                  className={`transition-transform duration-200 ${
                    catalogueOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {catalogueOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-1/2 top-full mt-3 -translate-x-1/2 min-w-[180px] rounded-[12px] border border-accent/[0.08] bg-surface-1/95 backdrop-blur-xl p-2 shadow-xl"
                  >
                    {CATALOGUE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setCatalogueOpen(false)}
                        className="block rounded-[8px] px-3 py-2 font-body font-medium text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body font-medium text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <WhatsappLogoIcon size={16} weight="fill" />
              Nous contacter
            </a>
          </div>

          <div className="flex items-center gap-1 md:justify-self-end">
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
              <Link
                href="/#values"
                onClick={() => setMobileOpen(false)}
                className="font-headline text-2xl font-bold text-text-primary py-3 border-b border-accent/[0.06] hover:text-accent-light transition-colors"
              >
                Nos services
              </Link>
              <p className="font-body text-xs uppercase tracking-widest text-text-muted pt-4 pb-1">
                Catalogue
              </p>
              {CATALOGUE_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-headline text-xl font-bold text-text-primary py-2 pl-3 border-b border-accent/[0.06] hover:text-accent-light transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center gap-2 font-headline text-2xl font-bold text-text-primary py-3 border-b border-accent/[0.06] hover:text-accent-light transition-colors"
              >
                <WhatsappLogoIcon size={22} weight="fill" />
                Nous contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
