import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  let footerLinks: { href: string; label: string }[] = [];

  try {
    const supabase = await createClient();
    const { data: pages } = await supabase
      .from("pages")
      .select("title, slug")
      .eq("published", true)
      .eq("show_in_footer", true)
      .order("sort_order", { ascending: true });

    if (pages && pages.length > 0) {
      footerLinks = pages.map((p) => ({ href: `/${p.slug}`, label: p.title }));
    }
  } catch {}

  return (
    <footer className="bg-surface-0 px-6 md:px-12 py-10 border-t border-accent/[0.04]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="ASE TECH"
            width={200}
            height={56}
            className="h-14 md:h-16 w-auto brightness-0 invert opacity-70"
          />
        </Link>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-xs text-text-muted/60">
          {new Date().getFullYear()} ASE Tech
        </span>
      </div>
    </footer>
  );
}
