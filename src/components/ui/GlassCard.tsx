"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  variant?: "base" | "elevated" | "interactive";
  glow?: "none" | "indigo" | "cyan" | "rose";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "base", glow = "none", children, ...props }, ref) => {
    const variantStyles = {
      base: "glass-panel rounded-spatial shadow-glass-sm",
      elevated: "glass-card-elevated rounded-spatial shadow-glass-md",
      interactive:
        "glass-card-elevated rounded-spatial shadow-glass-sm hover:shadow-glass-md transition-shadow cursor-pointer",
    };

    const glowStyles = {
      none: "",
      indigo: "hover:shadow-glow-indigo transition-shadow duration-300",
      cyan: "hover:shadow-glow-cyan transition-shadow duration-300",
      rose: "hover:shadow-glow-rose transition-shadow duration-300",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={variant === "interactive" ? { y: -2, scale: 1.005 } : undefined}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={cn(
          "relative overflow-hidden p-5",
          variantStyles[variant],
          glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
