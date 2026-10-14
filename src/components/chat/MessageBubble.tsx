"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Smile, Reply, Pin } from "lucide-react";

export interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface MessageProps {
  id: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
  isPinned?: boolean;
  reactions?: Reaction[];
  onReact?: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageProps> = ({
  id,
  senderName,
  senderAvatar,
  content,
  timestamp,
  isSelf,
  isPinned,
  reactions = [],
  onReact,
}) => {
  const [localReactions, setLocalReactions] = React.useState<Reaction[]>(reactions);
  const [showPicker, setShowPicker] = React.useState<boolean>(false);

  const handleToggleReaction = (emoji: string) => {
    setLocalReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.hasReacted) {
          return prev
            .map((r) =>
              r.emoji === emoji ? { ...r, count: r.count - 1, hasReacted: false } : r
            )
            .filter((r) => r.count > 0);
        } else {
          return prev.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1, hasReacted: true } : r
          );
        }
      } else {
        return [...prev, { emoji, count: 1, hasReacted: true }];
      }
    });
    onReact?.(id, emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "group relative flex gap-3 px-4 py-2 hover:bg-white/[0.03] transition-colors rounded-spatial-sm",
        isSelf ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Sender Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-spatial-sm bg-white/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-text-primary self-end">
        {senderAvatar}
      </div>

      {/* Bubble Container */}
      <div className={cn("max-w-[75%] flex flex-col gap-1", isSelf ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-text-primary">{senderName}</span>
          <span className="text-[10px] text-text-muted">{timestamp}</span>
          {isPinned && (
            <span className="flex items-center gap-0.5 text-[10px] text-brand-amber font-medium">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          )}
        </div>

        {/* The Spatial Glass Bubble */}
        <div
          className={cn(
            "relative px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-glass-sm",
            isSelf
              ? "bg-gradient-to-br from-brand-indigo to-indigo-600 text-white rounded-br-sm border border-white/20 shadow-glow-indigo/30"
              : "glass-card-elevated text-text-primary rounded-bl-sm border border-glass-border"
          )}
        >
          <p>{content}</p>

          {/* Micro Action Hover Bar */}
          <div
            className={cn(
              "absolute -top-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-1 p-1 rounded-full glass-card-elevated border border-white/20 shadow-glass-sm",
              isSelf ? "right-2" : "left-2"
            )}
          >
            {["❤️", "🔥", "🚀", "👍"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleToggleReaction(emoji)}
                className="w-6 h-6 flex items-center justify-center text-xs hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="p-1 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reaction Badges */}
        {localReactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 px-1">
            {localReactions.map((r) => (
              <motion.button
                key={r.emoji}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleToggleReaction(r.emoji)}
                className={cn(
                  "h-6 px-2 rounded-full text-xs flex items-center gap-1.5 transition-colors border",
                  r.hasReacted
                    ? "bg-brand-indigo/20 border-brand-indigo/40 text-brand-indigo dark:text-indigo-300 font-medium"
                    : "glass-pill border-glass-border text-text-secondary hover:bg-white/10"
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
