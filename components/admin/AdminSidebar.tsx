"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  Devices,
  FolderSimple,
  PencilLine,
  FileText,
  GearSix,
  SignOut,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour },
  { href: "/admin/products", label: "Produits", icon: Devices },
  { href: "/admin/categories", label: "Categories", icon: FolderSimple },
  { href: "/admin/content", label: "Contenu Landing", icon: PencilLine },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/settings", label: "Parametres", icon: GearSix },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex w-64 flex-col border-r border-admin-border bg-admin-card">
      <div className="border-b border-admin-border p-6">
        <h1 className="font-headline text-xl font-bold tracking-tight text-surface-0">
          ASE TECH
        </h1>
        <p className="mt-1 text-sm text-text-muted">Administration</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-admin-bg text-admin-success"
                : "text-text-muted hover:bg-admin-bg hover:text-surface-0"
            }`}
          >
            <Icon size={20} weight={isActive(href) ? "fill" : "regular"} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-admin-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-admin-warning transition-colors hover:bg-admin-bg"
        >
          <SignOut size={20} />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
