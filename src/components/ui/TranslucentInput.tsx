"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TranslucentInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const TranslucentInput = React.forwardRef<
  HTMLInputElement,
  TranslucentInputProps
>(({ className, icon, rightElement, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-11 rounded-spatial-sm px-3.5 text-sm transition-all duration-200 outline-none",
          "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 dark:border-white/10",
          "text-text-primary placeholder:text-text-muted",
          "focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/20 focus:bg-white/15 dark:focus:bg-white/8",
          icon && "pl-10",
          rightElement && "pr-10",
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 text-text-muted flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
});

TranslucentInput.displayName = "TranslucentInput";
