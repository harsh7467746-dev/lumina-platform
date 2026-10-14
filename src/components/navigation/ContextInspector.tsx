"use client";

import * as React from "react";
import { Users, Calendar, ShieldCheck, Sparkles, Hash, Volume2 } from "lucide-react";
import { StatusBadge, PresenceStatus } from "@/components/ui/StatusBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { CommunityItem, ChannelItem } from "./SpatialSidebar";

interface Member {
  id: string;
  name: string;
  role: string;
  status: PresenceStatus;
  avatar: string;
}

interface ContextInspectorProps {
  activeCommunity?: CommunityItem;
  activeChannel?: ChannelItem;
  onSelectMember?: (member: Member) => void;
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({
  activeCommunity,
  activeChannel,
  onSelectMember,
}) => {
  const members: Member[] = [
    { id: "m1", name: "Harsh (You)", role: "Platform Owner", status: "ONLINE", avatar: "HA" },
    { id: "m2", name: "Elena Rostova", role: "Design Lead", status: "ONLINE", avatar: "ER" },
    { id: "m3", name: "Marcus Chen", role: "Core Architect", status: "IDLE", avatar: "MC" },
    { id: "m4", name: "Sophia Alvarez", role: "Community Mod", status: "DND", avatar: "SA" },
    { id: "m5", name: "Liam Vance", role: "Member", status: "OFFLINE", avatar: "LV" },
  ];

  return (
    <aside className="hidden lg:flex w-72 h-full flex-col glass-card-elevated border-l border-glass-border select-none p-4 space-y-6 overflow-y-auto">
      {/* 1. Active Space Overview */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
          <span>Active Space</span>
        </h3>
        <GlassCard variant="base" className="p-3.5 space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-spatial-sm bg-brand-indigo/10 flex-shrink-0">
              {activeCommunity?.avatar || "🎨"}
            </span>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-text-primary truncate">
                {activeCommunity?.name || "Synthetix Design"}
              </h4>
              <p className="text-[11px] text-text-secondary line-clamp-2">
                {activeCommunity?.description || "Spatial interfaces & design systems"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-glass-border text-xs text-text-muted">
            <span className="flex items-center gap-1">
              {activeChannel?.type === "voice" ? (
                <Volume2 className="w-3 h-3 text-brand-emerald" />
              ) : (
                <Hash className="w-3 h-3 text-brand-indigo" />
              )}
              #{activeChannel?.name || "general"}
            </span>
            <span className="text-brand-emerald font-medium">182 Active</span>
          </div>
        </GlassCard>
      </div>

      {/* 2. Scheduled Plan Capsule */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Upcoming Plan</span>
        </h3>
        <GlassCard variant="interactive" glow="cyan" className="p-3.5 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="text-xs font-semibold text-text-primary">
                Spatial UI Workshop #04
              </h5>
              <span className="text-[11px] text-brand-cyan font-medium">
                Tomorrow • 18:00 UTC
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
              RSVP
            </span>
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2">
            Hands-on review of liquid-glass shaders and spring animation curves.
          </p>
        </GlassCard>
      </div>

      {/* 3. Community Members Roster */}
      <div className="flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-text-muted" />
          <span>Members in Room ({members.length})</span>
        </h3>
        <div className="space-y-1">
          {members.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMember?.(m)}
              className="flex items-center justify-between p-2 rounded-spatial-sm hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-spatial-sm bg-white/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-text-primary">
                    {m.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-text-muted">{m.role}</span>
                </div>
              </div>

              {m.role === "Platform Owner" && (
                <span title="Platform Owner">
                  <ShieldCheck className="w-4 h-4 text-brand-rose" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
