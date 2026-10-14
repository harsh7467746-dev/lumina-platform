"use client";

import * as React from "react";
import {
  MessageSquare,
  Users,
  Calendar,
  Settings,
  Hash,
  Volume2,
  ChevronDown,
  Plus,
  ShieldAlert,
  Megaphone,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge, PresenceStatus } from "@/components/ui/StatusBadge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface CommunityItem {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  unreadCount?: number;
}

export interface ChannelItem {
  id: string;
  name: string;
  type: "text" | "announcement" | "voice";
  description?: string;
  unread?: boolean;
}

export interface DirectMessageUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: PresenceStatus;
  lastMessage: string;
  unread?: boolean;
}

interface SpatialSidebarProps {
  activeSection: "chats" | "communities" | "plans" | "owner";
  onSelectSection: (section: "chats" | "communities" | "plans" | "owner") => void;
  communities: CommunityItem[];
  activeCommunityId: string;
  onSelectCommunity: (id: string) => void;
  channels: ChannelItem[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  directMessages?: DirectMessageUser[];
  activeDmId?: string;
  onSelectDm?: (id: string) => void;
  onAddChannel?: () => void;
  onAddCommunity?: () => void;
  onOpenSettings?: () => void;
  userStatus?: PresenceStatus;
  userName?: string;
  userHandle?: string;
  isOwner?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SpatialSidebar: React.FC<SpatialSidebarProps> = ({
  activeSection,
  onSelectSection,
  communities,
  activeCommunityId,
  onSelectCommunity,
  channels,
  activeChannelId,
  onSelectChannel,
  directMessages = [],
  activeDmId,
  onSelectDm,
  onAddChannel,
  onAddCommunity,
  onOpenSettings,
  userStatus = "ONLINE",
  userName = "Harsh",
  userHandle = "@harsh.lumina",
  isOwner = true,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const activeCommunity = communities.find((c) => c.id === activeCommunityId) || communities[0];

  const textChannels = channels.filter((c) => c.type === "text" || c.type === "announcement");
  const voiceChannels = channels.filter((c) => c.type === "voice");

  return (
    <>
      {/* Mobile Backdrop Overlay (only on mobile screens) */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Shell: Normal full-size on PC, sliding drawer on Mobile */}
      <aside
        className={cn(
          "h-full select-none z-50 flex transition-transform duration-200",
          "fixed inset-y-0 left-0 md:static md:translate-x-0",
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* 1. Spatial Guild Rail Bar: Full 72px on PC, compact 56px on Mobile */}
        <div className="w-14 md:w-[72px] h-full flex flex-col items-center py-4 gap-3 border-r border-glass-border glass-panel flex-shrink-0">
          {/* Logo Icon */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onSelectSection("communities");
              onCloseMobile?.();
            }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-spatial-sm md:rounded-spatial bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-glow-indigo cursor-pointer"
            title="Lumina Home"
          >
            <span className="font-bold text-base md:text-lg tracking-wider">L</span>
          </motion.div>

          <div className="w-6 md:w-8 h-[1px] bg-glass-border my-1" />

          {/* Community List */}
          <div className="flex-1 w-full flex flex-col items-center gap-2.5 overflow-y-auto no-scrollbar">
            {communities.map((c) => {
              const isActive = activeCommunityId === c.id && activeSection === "communities";
              return (
                <div key={c.id} className="relative group flex items-center justify-center w-full">
                  {/* Active Indicator Pill */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? 36 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    className="absolute left-0 w-1 bg-brand-indigo rounded-r-full"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSelectSection("communities");
                      onSelectCommunity(c.id);
                    }}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-spatial-xs md:rounded-spatial-sm flex items-center justify-center text-lg md:text-xl transition-all duration-200 relative",
                      isActive
                        ? "bg-brand-indigo text-white shadow-glow-indigo rounded-spatial-sm md:rounded-spatial"
                        : "bg-white/10 dark:bg-white/5 text-text-primary hover:bg-white/15 dark:hover:bg-white/10 border border-white/10"
                    )}
                    title={c.name}
                  >
                    <span>{c.avatar}</span>
                    {c.unreadCount ? (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {c.unreadCount}
                      </span>
                    ) : null}
                  </motion.button>
                </div>
              );
            })}

            {/* Add Community Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddCommunity}
              className="w-10 h-10 md:w-12 md:h-12 rounded-spatial-xs md:rounded-spatial-sm border border-dashed border-glass-border flex items-center justify-center text-text-secondary hover:text-brand-indigo hover:border-brand-indigo/50 hover:bg-brand-indigo/10 transition-colors"
              title="Create New Community"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>

          {/* Bottom Rail Actions */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-glass-border w-full">
            {isOwner && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onSelectSection("owner");
                  onCloseMobile?.();
                }}
                className={cn(
                  "w-10 h-10 md:w-11 md:h-11 rounded-spatial-xs md:rounded-spatial-sm flex items-center justify-center transition-colors relative",
                  activeSection === "owner"
                    ? "bg-brand-rose/20 text-brand-rose border border-brand-rose/40 shadow-glow-rose"
                    : "text-brand-rose/80 hover:bg-brand-rose/15 hover:text-brand-rose"
                )}
                title="Owner Command Center"
              >
                <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            )}

            <ThemeToggle />
          </div>
        </div>

        {/* 2. Workspace Navigation Sub-Panel: Full 240px (w-60) on PC, 220px on Mobile */}
        <div className="w-[220px] md:w-60 h-full flex flex-col glass-card-elevated border-r border-glass-border select-none bg-canvas-dark/95 md:bg-transparent">
          {/* Section Header */}
          <div className="h-14 md:h-16 px-4 flex items-center justify-between border-b border-glass-border">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-lg md:text-xl p-1.5 rounded-spatial-xs bg-white/10 dark:bg-white/5 flex-shrink-0">
                {activeSection === "chats"
                  ? "💬"
                  : activeSection === "plans"
                  ? "📅"
                  : activeSection === "owner"
                  ? "🛡️"
                  : activeCommunity?.avatar || "🎨"}
              </span>
              <div className="overflow-hidden">
                <h2 className="text-xs md:text-sm font-semibold text-text-primary tracking-tight leading-none truncate">
                  {activeSection === "chats"
                    ? "Direct Messages"
                    : activeSection === "plans"
                    ? "Plans & Events"
                    : activeSection === "owner"
                    ? "Security Center"
                    : activeCommunity?.name || "Synthetix Design"}
                </h2>
                <span className="text-[10px] md:text-[11px] text-text-secondary truncate block mt-0.5">
                  {activeSection === "chats"
                    ? "Private conversations"
                    : activeSection === "plans"
                    ? "Schedules & Meetups"
                    : activeSection === "owner"
                    ? "Audit & Permissions"
                    : "Community Guild"}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Section Buttons: Full size on PC, compact on Mobile */}
          <div className="p-3 flex flex-col gap-1 border-b border-glass-border">
            <button
              onClick={() => onSelectSection("communities")}
              className={cn(
                "w-full h-8 md:h-9 px-2.5 rounded-spatial-sm flex items-center gap-2.5 text-xs font-medium transition-colors",
                activeSection === "communities"
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Channels & Rooms</span>
            </button>

            <button
              onClick={() => onSelectSection("chats")}
              className={cn(
                "w-full h-8 md:h-9 px-2.5 rounded-spatial-sm flex items-center gap-2.5 text-xs font-medium transition-colors",
                activeSection === "chats"
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Direct Messages</span>
            </button>

            <button
              onClick={() => onSelectSection("plans")}
              className={cn(
                "w-full h-8 md:h-9 px-2.5 rounded-spatial-sm flex items-center gap-2.5 text-xs font-medium transition-colors",
                activeSection === "plans"
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Plans & Events</span>
            </button>
          </div>

          {/* Dynamic Channels / DMs list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {activeSection === "chats" ? (
              <div>
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Direct Chats
                  </span>
                </div>
                <div className="space-y-1">
                  {directMessages.map((dm) => {
                    const isActive = activeDmId === dm.id;
                    return (
                      <button
                        key={dm.id}
                        onClick={() => {
                          onSelectDm?.(dm.id);
                          onCloseMobile?.();
                        }}
                        className={cn(
                          "w-full p-2 rounded-spatial-sm flex items-center gap-2.5 text-xs transition-colors text-left",
                          isActive
                            ? "bg-brand-indigo/15 text-brand-indigo font-medium border border-brand-indigo/30"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-7 h-7 rounded-spatial-xs bg-brand-indigo/20 text-brand-indigo font-bold flex items-center justify-center text-[10px]">
                            {dm.avatar}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <StatusBadge status={dm.status} size="sm" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-text-primary truncate block text-xs">
                            {dm.name}
                          </span>
                          <p className="text-[10px] text-text-muted truncate mt-0.5">
                            {dm.lastMessage}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Text Channels */}
                <div>
                  <div className="flex items-center justify-between px-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Text Rooms
                    </span>
                    <button
                      onClick={onAddChannel}
                      className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
                      title="Add Text Channel"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {textChannels.map((ch) => {
                      const isActive = activeChannelId === ch.id && activeSection === "communities";
                      const isAnnouncement = ch.type === "announcement";
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            onSelectSection("communities");
                            onSelectChannel(ch.id);
                            onCloseMobile?.();
                          }}
                          className={cn(
                            "w-full h-8 px-2 rounded-spatial-sm flex items-center justify-between text-xs transition-colors",
                            isActive
                              ? "bg-white/15 dark:bg-white/10 text-brand-indigo dark:text-white font-medium border border-white/10 shadow-sm"
                              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isAnnouncement ? (
                              <Megaphone className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                            ) : (
                              <Hash className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                            )}
                            <span className="truncate">{ch.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Channels */}
                {voiceChannels.length > 0 && (
                  <div className="pt-2 border-t border-glass-border">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Voice Lounges
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      {voiceChannels.map((ch) => {
                        const isActive = activeChannelId === ch.id && activeSection === "communities";
                        return (
                          <button
                            key={ch.id}
                            onClick={() => {
                              onSelectSection("communities");
                              onSelectChannel(ch.id);
                              onCloseMobile?.();
                            }}
                            className={cn(
                              "w-full h-8 px-2 rounded-spatial-sm flex items-center justify-between text-xs transition-colors",
                              isActive
                                ? "bg-brand-emerald/15 text-brand-emerald font-medium border border-brand-emerald/30 shadow-sm"
                                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Volume2 className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0" />
                              <span className="truncate">{ch.name}</span>
                            </div>
                            <span className="text-[10px] text-brand-emerald font-semibold px-1.5 py-0.5 rounded bg-brand-emerald/10">
                              LIVE
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Current User Micro Capsule: Full layout on PC */}
          <div className="p-3 border-t border-glass-border flex items-center justify-between">
            <div
              onClick={onOpenSettings}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity overflow-hidden"
              title="Account & Status"
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-spatial-sm bg-gradient-to-tr from-brand-indigo to-brand-violet flex items-center justify-center text-white font-semibold text-xs border border-white/20">
                  {userName.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <StatusBadge status={userStatus} size="sm" />
                </div>
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-semibold text-text-primary leading-tight truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-text-muted truncate">{userHandle}</span>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-spatial-sm text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors flex-shrink-0"
              title="Spatial Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
