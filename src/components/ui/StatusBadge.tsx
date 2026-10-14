"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PresenceStatus = "ONLINE" | "IDLE" | "DND" | "OFFLINE";

interface StatusBadgeProps {
  status: PresenceStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showLabel = false,
  className,
}) => {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5",
  };

  const statusConfig = {
    ONLINE: {
      color: "bg-brand-emerald",
      ring: "ring-brand-emerald/30",
      label: "Online",
      pulse: true,
    },
    IDLE: {
      color: "bg-brand-amber",
      ring: "ring-brand-amber/30",
      label: "Away",
      pulse: false,
    },
    DND: {
      color: "bg-brand-rose",
      ring: "ring-brand-rose/30",
      label: "Do Not Disturb",
      pulse: false,
    },
    OFFLINE: {
      color: "bg-slate-400 dark:bg-slate-600",
      ring: "ring-slate-400/20",
      label: "Offline",
      pulse: false,
    },
  };

  const current = statusConfig[status];

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span className="relative flex">
        {current.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              current.color
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full ring-2",
            dotSizes[size],
            current.color,
            current.ring
          )}
        />
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary">
          {current.label}
        </span>
      )}
    </div>
  );
};
