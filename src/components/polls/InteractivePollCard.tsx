"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, BarChart2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  id: string;
  question: string;
  creatorName: string;
  options: PollOption[];
  totalVotes: number;
  hasVotedId?: string;
  isMultiChoice?: boolean;
}

export const InteractivePollCard: React.FC<PollProps> = ({
  question,
  creatorName,
  options: initialOptions,
  totalVotes: initialTotal,
  hasVotedId,
}) => {
  const [options, setOptions] = React.useState<PollOption[]>(initialOptions);
  const [selectedId, setSelectedId] = React.useState<string | undefined>(hasVotedId);
  const [total, setTotal] = React.useState<number>(initialTotal);

  const handleVote = (optionId: string) => {
    if (selectedId === optionId) return; // already voted

    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (opt.id === selectedId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      })
    );

    if (!selectedId) {
      setTotal((prev) => prev + 1);
    }
    setSelectedId(optionId);
  };

  return (
    <GlassCard variant="elevated" className="p-5 max-w-md w-full border border-white/15 dark:border-white/10 shadow-glass-md">
      <div className="flex items-center justify-between pb-3 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brand-indigo" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Live Community Poll
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <Clock className="w-3 h-3" />
          <span>Closes in 2 days</span>
        </div>
      </div>

      <div className="py-3">
        <h4 className="text-sm font-semibold text-text-primary leading-snug">
          {question}
        </h4>
        <span className="text-[11px] text-text-muted">Created by {creatorName}</span>
      </div>

      {/* Options */}
      <div className="space-y-2 pt-1">
        {options.map((opt) => {
          const percentage = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isSelected = selectedId === opt.id;

          return (
            <motion.div
              key={opt.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleVote(opt.id)}
              className={cn(
                "relative overflow-hidden p-3 rounded-spatial-sm border cursor-pointer select-none transition-all duration-200",
                isSelected
                  ? "border-brand-indigo/60 bg-brand-indigo/10 shadow-glass-sm"
                  : "border-glass-border hover:border-white/20 bg-white/5"
              )}
            >
              {/* Progress fill bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className={cn(
                  "absolute inset-y-0 left-0 -z-0 opacity-20",
                  isSelected ? "bg-brand-indigo" : "bg-slate-400 dark:bg-white"
                )}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-brand-indigo bg-brand-indigo text-white"
                        : "border-text-muted/40"
                    )}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-medium text-text-primary">
                    {opt.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className={isSelected ? "text-brand-indigo" : "text-text-secondary"}>
                    {percentage}%
                  </span>
                  <span className="text-[10px] text-text-muted font-normal">
                    ({opt.votes})
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-3.5 flex items-center justify-between text-xs text-text-muted border-t border-glass-border mt-3">
        <span>Total Votes: {total}</span>
        <span>Single Choice</span>
      </div>
    </GlassCard>
  );
};
