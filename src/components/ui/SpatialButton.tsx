"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SpatialButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "glass" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  glow?: boolean;
}

export const SpatialButton = React.forwardRef<HTMLButtonElement, SpatialButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/50 disabled:opacity-50 disabled:pointer-events-none";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-spatial-sm gap-1.5",
      md: "h-10 px-4 text-sm rounded-spatial-sm gap-2",
      lg: "h-12 px-6 text-base rounded-spatial gap-2.5",
      icon: "h-10 w-10 p-0 rounded-spatial-sm justify-center",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-brand-indigo to-indigo-600 text-white shadow-glass-sm border border-white/20 hover:brightness-110",
      secondary:
        "bg-brand-violet/15 text-brand-violet dark:text-violet-300 border border-brand-violet/20 hover:bg-brand-violet/25",
      glass:
        "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 dark:border-white/10 text-foreground shadow-glass-sm hover:bg-white/15 dark:hover:bg-white/10",
      danger:
        "bg-brand-rose/20 text-brand-rose border border-brand-rose/30 hover:bg-brand-rose/30",
      ghost:
        "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent",
    };

    const glowStyles = glow ? "shadow-glow-indigo" : "";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], glowStyles, className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

SpatialButton.displayName = "SpatialButton";
