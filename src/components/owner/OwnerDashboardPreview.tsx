"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpatialButton } from "@/components/ui/SpatialButton";
import { TranslucentInput } from "@/components/ui/TranslucentInput";
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Lock,
  Eye,
  FileText,
  UserX,
  CheckCircle2,
  Cpu,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityEvent {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  target: string;
  timestamp: string;
  details: string;
}

export const OwnerDashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"metrics" | "safety" | "review" | "audit">("metrics");
  const [reportIdInput, setReportIdInput] = React.useState<string>("rep_98214");
  const [justificationInput, setJustificationInput] = React.useState<string>("");
  const [isReviewUnlocked, setIsReviewUnlocked] = React.useState<boolean>(false);
  const [auditEntries, setAuditEntries] = React.useState<string[]>([
    "[18:42:01 UTC] [OWNER_BOOTSTRAP] Single Owner Root established with UUID e28a...b71",
    "[18:45:12 UTC] [POLICY_UPDATE] Global message rate limits initialized: 60/min",
  ]);

  const securityEvents: SecurityEvent[] = [
    {
      id: "sec_1",
      type: "Rapid Authentication Failure",
      severity: "CRITICAL",
      target: "IP 194.26.29.11",
      timestamp: "3m ago",
      details: "12 consecutive invalid password attempts against account @elena",
    },
    {
      id: "sec_2",
      type: "High Velocity Spam Threshold",
      severity: "HIGH",
      target: "@bot_phantom4",
      timestamp: "14m ago",
      details: "Created 18 duplicate messages within 10 seconds in #study-lounge",
    },
    {
      id: "sec_3",
      type: "Reported Harassment Flag",
      severity: "MEDIUM",
      target: "@rogue_user9",
      timestamp: "32m ago",
      details: "User reported for offensive speech in community Synthetix Design",
    },
  ];

  const handleUnlockReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportIdInput.trim() || !justificationInput.trim()) {
      alert("Both an active Report ID and formal Justification are legally required to review private threads.");
      return;
    }
    setIsReviewUnlocked(true);
    const newLog = `[${new Date().toLocaleTimeString()} UTC] [OWNER_AUTHORIZED_REVIEW] Target Report: ${reportIdInput} | Justification: "${justificationInput}" | Accessor: Single Owner`;
    setAuditEntries((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-spatial-sm bg-brand-rose/20 text-brand-rose border border-brand-rose/30 flex items-center justify-center shadow-glow-rose/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">
                Owner Command Center
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-rose/20 text-brand-rose border border-brand-rose/30">
                Single Root Authority
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Strictly restricted to the verified platform Owner. Every action generates an immutable audit record.
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-spatial-sm bg-white/5 border border-glass-border">
          {[
            { id: "metrics", label: "Health & Telemetry" },
            { id: "safety", label: "Trust & Safety" },
            { id: "review", label: "Authorized Chat Review" },
            { id: "audit", label: "Immutable Audit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: METRICS & TELEMETRY */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard variant="elevated" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Active Sockets</span>
                <Radio className="w-4 h-4 text-brand-emerald animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-text-primary">1,482</div>
              <span className="text-[11px] text-brand-emerald font-medium">+14% in last hour</span>
            </GlassCard>

            <GlassCard variant="elevated" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Message Velocity</span>
                <Activity className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="text-2xl font-bold text-text-primary">242 / min</div>
              <span className="text-[11px] text-text-muted">Nominal operating range</span>
            </GlassCard>

            <GlassCard variant="elevated" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>System Health</span>
                <Cpu className="w-4 h-4 text-brand-indigo" />
              </div>
              <div className="text-2xl font-bold text-brand-emerald">99.98%</div>
              <span className="text-[11px] text-text-muted">Latency: 28ms avg</span>
            </GlassCard>

            <GlassCard variant="elevated" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Security Anomalies</span>
                <AlertTriangle className="w-4 h-4 text-brand-rose" />
              </div>
              <div className="text-2xl font-bold text-brand-rose">1 Critical</div>
              <span className="text-[11px] text-brand-rose font-medium">Action required</span>
            </GlassCard>
          </div>

          <GlassCard variant="elevated" className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Root Single-Owner Security Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-spatial-sm bg-white/5 border border-glass-border">
                <span className="text-text-muted block">Database Constraint</span>
                <span className="text-brand-emerald font-semibold mt-1 block">
                  ACTIVE: single_owner_idx (Max 1 Owner)
                </span>
              </div>
              <div className="p-3 rounded-spatial-sm bg-white/5 border border-glass-border">
                <span className="text-text-muted block">2FA Enforcement</span>
                <span className="text-brand-emerald font-semibold mt-1 block">
                  ENABLED (Hardware FIDO2 / TOTP)
                </span>
              </div>
              <div className="p-3 rounded-spatial-sm bg-white/5 border border-glass-border">
                <span className="text-text-muted block">Public Admin Registration</span>
                <span className="text-brand-rose font-semibold mt-1 block">
                  FORBIDDEN & FILTERED AT INGRESS
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: TRUST & SAFETY */}
      {activeTab === "safety" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Automated Anomaly & Threat Queue
          </h3>
          <div className="space-y-3">
            {securityEvents.map((ev) => {
              const badgeColors = {
                CRITICAL: "bg-brand-rose/20 text-brand-rose border-brand-rose/30",
                HIGH: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                INFO: "bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30",
              };

              return (
                <GlassCard key={ev.id} variant="elevated" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", badgeColors[ev.severity])}>
                        {ev.severity}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{ev.type}</span>
                      <span className="text-xs text-text-muted">• {ev.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{ev.details}</p>
                    <span className="text-[11px] font-mono text-brand-indigo">Target: {ev.target}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SpatialButton size="sm" variant="danger">
                      <UserX className="w-3.5 h-3.5" /> Suspend
                    </SpatialButton>
                    <SpatialButton size="sm" variant="glass">
                      Investigate
                    </SpatialButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AUTHORIZED CHAT REVIEW */}
      {activeTab === "review" && (
        <GlassCard variant="elevated" className="p-6 max-w-2xl space-y-5 border border-white/20">
          <div className="flex items-center gap-3 pb-3 border-b border-glass-border">
            <Lock className="w-5 h-5 text-brand-amber" />
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Authorized Private Chat Review Protocol
              </h3>
              <p className="text-xs text-text-secondary">
                Private chats have zero unrestricted backdoors. Access requires a verified Report ID and formal justification.
              </p>
            </div>
          </div>

          {!isReviewUnlocked ? (
            <form onSubmit={handleUnlockReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1.5">
                  Associated Safety Report ID
                </label>
                <TranslucentInput
                  value={reportIdInput}
                  onChange={(e) => setReportIdInput(e.target.value)}
                  placeholder="e.g. rep_98214"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1.5">
                  Formal Moderation Justification Statement
                </label>
                <textarea
                  value={justificationInput}
                  onChange={(e) => setJustificationInput(e.target.value)}
                  placeholder="Explain the safety requirement, legal basis, or reported incident that necessitates reviewing this thread..."
                  rows={3}
                  required
                  className="w-full rounded-spatial-sm p-3 text-xs outline-none bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 dark:border-white/10 text-text-primary focus:border-brand-indigo/50"
                />
              </div>

              <div className="p-3 rounded-spatial-sm bg-brand-amber/10 border border-brand-amber/20 text-xs text-amber-300">
                Notice: Unlocking this thread will generate an immutable, tamper-resistant record in the platform audit ledger recording your Owner UUID, IP address, timestamp, and justification.
              </div>

              <SpatialButton type="submit" variant="primary" className="w-full">
                <Eye className="w-4 h-4 mr-2" /> Authorize & Unlock Thread
              </SpatialButton>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-spatial-sm bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-between text-xs text-brand-emerald">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized Review Session Active (Audit Log Recorded)</span>
                </div>
                <button
                  onClick={() => setIsReviewUnlocked(false)}
                  className="underline hover:text-white"
                >
                  Close Session
                </button>
              </div>

              <div className="p-4 rounded-spatial bg-black/20 border border-glass-border space-y-3">
                <div className="text-xs text-text-muted pb-2 border-b border-glass-border">
                  Thread between @victim_user and @suspect_user9 (Report {reportIdInput})
                </div>
                <div className="p-2.5 rounded-spatial-sm bg-white/5 text-xs text-text-primary">
                  <span className="font-semibold text-brand-rose">@suspect_user9:</span> Send me your private credentials right now or I will post your personal details online.
                </div>
                <div className="p-2.5 rounded-spatial-sm bg-white/5 text-xs text-text-primary">
                  <span className="font-semibold text-brand-indigo">@victim_user:</span> Please stop messaging me, I am reporting this to the owner.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <SpatialButton variant="danger" size="sm">
                  Ban Perpetrator Account
                </SpatialButton>
                <SpatialButton variant="glass" size="sm">
                  Dismiss False Report
                </SpatialButton>
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* TAB 4: AUDIT LEDGER */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-text-muted" />
              <span>Immutable Administrative Audit Ledger</span>
            </h3>
            <span className="text-[11px] text-brand-emerald font-mono">
              Integrity Status: Cryptographically Verified
            </span>
          </div>

          <div className="space-y-2">
            {auditEntries.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-spatial-sm bg-white/5 border border-glass-border text-xs font-mono text-text-secondary leading-relaxed"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
