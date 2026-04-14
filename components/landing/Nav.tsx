"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, ShoppingBag } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/products", label: "Produits" },
  { href: "/products?category=iPhone", label: "iPhone" },
  { href: "/products?category=MacBook", label: "MacBook" },
  { href: "/products?category=iPad", label: "iPad" },
  { href: "/products?category=Watch", label: "Watch" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 w-full z-40 border-b border-[rgba(138,158,150,0.04)] transition-colors duration-300"
      style={{
        background: scrolled ? "rgba(17,22,20,0.85)" : "rgba(17,22,20,0.6)",
        backdropFilter: "blur(40px) saturate(1.4)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3.5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="ASE TECH" width={100} height={32} className="h-8 w-auto brightness-200" />
        </Link>
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="font-body font-medium text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200">
            <MagnifyingGlass size={20} />
          </button>
          <button className="p-2 rounded-[10px] text-text-muted hover:bg-surface-3 hover:text-text-primary transition-all duration-200">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
