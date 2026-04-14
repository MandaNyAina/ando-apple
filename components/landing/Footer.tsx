import Link from "next/link";

const FOOTER_LINKS = [
  { href: "#", label: "Politique de confidentialité" },
  { href: "#", label: "CGV" },
  { href: "#", label: "Garantie" },
  { href: "#", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-surface-0 px-6 md:px-12 py-10 border-t border-[rgba(138,158,150,0.04)]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-headline font-bold text-text-muted text-sm tracking-wide">ASE TECH</span>
        <div className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="text-xs text-text-muted hover:text-text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-[11px] text-[rgba(138,158,150,0.3)]">{new Date().getFullYear()} ASE Tech</span>
      </div>
    </footer>
  );
}
