"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheckIcon,
  TagIcon,
  StarIcon,
  HeadsetIcon,
  MagnifyingGlassIcon,
  CurrencyCircleDollarIcon,
  RecycleIcon,
  CertificateIcon,
  HeartIcon,
  LightningIcon,
  CheckCircleIcon,
  HandshakeIcon,
  TrophyIcon,
  LeafIcon,
  LockIcon,
  TruckIcon,
  PackageIcon,
  WrenchIcon,
  CrownIcon,
  GiftIcon,
  ClockIcon,
  PhoneIcon,
  ChatCircleIcon,
  RocketIcon,
  CaretDownIcon,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

export const ADMIN_ICON_MAP: Record<string, PhosphorIcon> = {
  ShieldCheck: ShieldCheckIcon,
  Tag: TagIcon,
  Star: StarIcon,
  Headset: HeadsetIcon,
  MagnifyingGlass: MagnifyingGlassIcon,
  CurrencyCircleDollar: CurrencyCircleDollarIcon,
  Recycle: RecycleIcon,
  Certificate: CertificateIcon,
  Heart: HeartIcon,
  Lightning: LightningIcon,
  CheckCircle: CheckCircleIcon,
  Handshake: HandshakeIcon,
  Trophy: TrophyIcon,
  Leaf: LeafIcon,
  Lock: LockIcon,
  Truck: TruckIcon,
  Package: PackageIcon,
  Wrench: WrenchIcon,
  Crown: CrownIcon,
  Gift: GiftIcon,
  Clock: ClockIcon,
  Phone: PhoneIcon,
  ChatCircle: ChatCircleIcon,
  Rocket: RocketIcon,
};

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalized = value.replace(/Icon$/, "");
  const Selected = ADMIN_ICON_MAP[normalized] ?? StarIcon;

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-surface-0 outline-none transition-colors hover:border-admin-success focus:border-admin-success focus:ring-1 focus:ring-admin-success"
      >
        <span className="flex items-center gap-2">
          <Selected size={20} weight="fill" className="text-admin-success" />
          <span className="font-medium">{normalized || "Choisir une icône"}</span>
        </span>
        <CaretDownIcon
          size={14}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-lg border border-admin-border bg-white p-2 shadow-lg">
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(ADMIN_ICON_MAP).map(([name, Icon]) => {
              const isActive = name === normalized;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  title={name}
                  className={`flex flex-col items-center gap-1 rounded-md p-2 text-[10px] transition-colors ${
                    isActive
                      ? "bg-admin-success/10 text-admin-success ring-1 ring-admin-success"
                      : "text-text-muted hover:bg-admin-bg hover:text-surface-0"
                  }`}
                >
                  <Icon size={20} weight="fill" />
                  <span className="w-full truncate text-center leading-tight">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
