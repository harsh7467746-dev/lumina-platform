"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpatialButton } from "@/components/ui/SpatialButton";
import { Calendar, Clock, MapPin, Bell, Check, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type RSVPStatus = "GOING" | "MAYBE" | "DECLINED";

interface PlanProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  initialRSVP?: RSVPStatus;
  attendeesCount: number;
}

export const InteractivePlanCard: React.FC<PlanProps> = ({
  title,
  description,
  date,
  time,
  location,
  organizerName,
  initialRSVP = "GOING",
  attendeesCount: initialAttendees,
}) => {
  const [rsvp, setRsvp] = React.useState<RSVPStatus>(initialRSVP);
  const [attendees, setAttendees] = React.useState<number>(initialAttendees);
  const [reminderSet, setReminderSet] = React.useState<boolean>(true);

  const handleRSVP = (status: RSVPStatus) => {
    if (rsvp === status) return;
    if (status === "GOING" && rsvp !== "GOING") setAttendees((a) => a + 1);
    if (rsvp === "GOING" && status !== "GOING") setAttendees((a) => Math.max(0, a - 1));
    setRsvp(status);
  };

  return (
    <GlassCard variant="elevated" className="p-5 max-w-md w-full border border-white/15 dark:border-white/10 shadow-glass-md space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-spatial-sm bg-gradient-to-br from-brand-cyan to-blue-600 flex flex-col items-center justify-center text-white shadow-glow-cyan/20">
            <span className="text-[10px] uppercase font-bold tracking-widest leading-none">SEP</span>
            <span className="text-base font-extrabold leading-none mt-0.5">24</span>
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-primary tracking-tight">
              {title}
            </h4>
            <span className="text-xs text-text-muted">Host: {organizerName}</span>
          </div>
        </div>

        <button
          onClick={() => setReminderSet(!reminderSet)}
          className={cn(
            "p-2 rounded-spatial-sm transition-colors border",
            reminderSet
              ? "bg-brand-indigo/20 border-brand-indigo/40 text-brand-indigo shadow-glass-sm"
              : "border-glass-border text-text-muted hover:text-text-primary"
          )}
          title={reminderSet ? "Reminder Active" : "Set Reminder"}
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        {description}
      </p>

      {/* Meta Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-spatial-sm bg-white/5 border border-glass-border text-text-primary">
          <Clock className="w-3.5 h-3.5 text-brand-cyan" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-spatial-sm bg-white/5 border border-glass-border text-text-primary">
          <MapPin className="w-3.5 h-3.5 text-brand-rose" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Attendees Row & RSVP Switcher */}
      <div className="pt-2 border-t border-glass-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {["HA", "ER", "MC"].map((initials, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-white/20 bg-brand-indigo/80 text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
              >
                {initials}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-text-muted">
            {attendees} going
          </span>
        </div>

        {/* RSVP Segmented Controller */}
        <div className="flex items-center gap-1 p-1 rounded-spatial-sm bg-white/5 border border-glass-border">
          <button
            onClick={() => handleRSVP("GOING")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all",
              rsvp === "GOING"
                ? "bg-brand-emerald text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Check className="w-3 h-3" /> Going
          </button>
          <button
            onClick={() => handleRSVP("MAYBE")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all",
              rsvp === "MAYBE"
                ? "bg-brand-amber text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <HelpCircle className="w-3 h-3" /> Maybe
          </button>
          <button
            onClick={() => handleRSVP("DECLINED")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all",
              rsvp === "DECLINED"
                ? "bg-brand-rose text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <X className="w-3 h-3" /> No
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
