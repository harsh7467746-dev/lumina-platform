"use client";

import * as React from "react";
import { MessageSquare, Users, Calendar, User, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingDockProps {
  activeTab: "chats" | "communities" | "plans" | "profile" | "owner";
  onTabChange: (tab: "chats" | "communities" | "plans" | "profile" | "owner") => void;
  isOwner?: boolean;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onTabChange,
  isOwner = true,
}) => {
  const tabs = [
    { id: "communities", label: "Guilds", icon: Users, badge: 3 },
    { id: "chats", label: "Chats", icon: MessageSquare, badge: 1 },
    { id: "plans", label: "Plans", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  if (isOwner) {
    tabs.push({ id: "owner", label: "Owner", icon: ShieldAlert });
  }

  return (
    <div className="md:hidden fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={cn(
          "pointer-events-auto h-16 px-3 rounded-full flex items-center gap-1.5",
          "glass-card-elevated shadow-glass-lg border border-white/20 dark:border-white/10"
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id as any)}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
                isActive
                  ? "text-white bg-brand-indigo shadow-glow-indigo"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/10"
              )}
            >
              <Icon className="w-5 h-5" />
              {tab.badge && !isActive && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-rose" />
              )}
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};
