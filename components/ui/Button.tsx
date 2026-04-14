"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  children: ReactNode;
}

export function Button({ variant = "solid", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-[12px] font-body font-semibold text-[13px] cursor-pointer transition-colors duration-200";
  const variants = {
    solid: "bg-accent text-surface-0 hover:bg-accent-light px-8 py-4",
    outline: "border border-[rgba(138,158,150,0.15)] text-text-primary hover:border-[rgba(138,158,150,0.3)] hover:bg-surface-2 px-8 py-4",
  };

  return (
    <motion.button
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
