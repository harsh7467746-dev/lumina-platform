"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  SpatialSidebar,
  CommunityItem,
  ChannelItem,
  DirectMessageUser,
} from "@/components/navigation/SpatialSidebar";
import { ContextInspector } from "@/components/navigation/ContextInspector";
import { FloatingDock } from "@/components/navigation/FloatingDock";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { InteractivePollCard } from "@/components/polls/InteractivePollCard";
import { InteractivePlanCard } from "@/components/plans/InteractivePlanCard";
import { OwnerDashboardPreview } from "@/components/owner/OwnerDashboardPreview";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpatialButton } from "@/components/ui/SpatialButton";
import { TranslucentInput } from "@/components/ui/TranslucentInput";
import { GlassModal } from "@/components/ui/GlassModal";
import { PresenceStatus } from "@/components/ui/StatusBadge";
import {
  Hash,
  Search,
  Paperclip,
  Smile,
  Send,
  PlusCircle,
  Calendar,
  BarChart2,
  Sparkles,
  ShieldAlert,
  Bell,
  Volume2,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Megaphone,
  Check,
  User,
  X,
  FileText,
  Menu,
  LogIn,
  LogOut,
} from "lucide-react";

interface MessageItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number; hasReacted: boolean }[];
  attachment?: { name: string; size: string; type: "image" | "file"; url?: string };
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function PlatformHomePage() {
  const router = useRouter();

  // Navigation & Space States
  const [activeSection, setActiveSection] = React.useState<
    "chats" | "communities" | "plans" | "owner"
  >("communities");

  // Mobile Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState<boolean>(false);

  // Authenticated User State
  const [currentUser, setCurrentUser] = React.useState<{
    id?: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    status: PresenceStatus;
  }>({
    username: "harsh",
    displayName: "Harsh",
    status: "ONLINE",
  });

  // Check login session on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("lumina_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.username) {
          setCurrentUser({
            id: u.id,
            username: u.username,
            displayName: u.displayName || u.username,
            avatarUrl: u.avatarUrl,
            status: (u.status as PresenceStatus) || "ONLINE",
          });
        }
      }
    } catch {}
  }, []);

  // Communities Collection
  const [communities, setCommunities] = React.useState<CommunityItem[]>([
    {
      id: "comm_1",
      name: "Synthetix Design",
      avatar: "🎨",
      description: "Spatial interfaces, frosted glass physics & design systems",
      unreadCount: 0,
    },
    {
      id: "comm_2",
      name: "AI & Neural Lab",
      avatar: "⚡",
      description: "Autonomous agents, latent spaces & model alignment research",
    },
    {
      id: "comm_3",
      name: "Global Campus Guild",
      avatar: "🎓",
      description: "Collaborative study lounges, hackathons & student builders",
    },
    {
      id: "comm_4",
      name: "Cosmic Audio Hub",
      avatar: "🎧",
      description: "Spatial audio design, modular synth experiments & live jams",
    },
  ]);

  const [activeCommunityId, setActiveCommunityId] = React.useState<string>("comm_1");

  // Channels Collection by Community
  const [channelsByCommunity, setChannelsByCommunity] = React.useState<
    Record<string, ChannelItem[]>
  >({
    comm_1: [
      { id: "chan_ann", name: "announcements", type: "announcement", description: "Official Synthetix design system releases and notes." },
      { id: "chan_1", name: "general", type: "text", description: "Spatial design discussions, layout showcases & pair feedback." },
      { id: "chan_2", name: "ideas-and-projects", type: "text", description: "Share prototypes, Figma components and micro-interactions." },
      { id: "chan_3", name: "study-lounge", type: "text", description: "Quiet co-working, CSS shader research and KaTeX equations." },
      { id: "chan_4", name: "resource-vault", type: "text", description: "Icon packs, design token presets and Tailwind color palettes." },
      { id: "chan_voice_1", name: "Design Critique Stage", type: "voice", description: "Real-time spatial voice lounge for screen-sharing and UI critiques." },
    ],
    comm_2: [
      { id: "chan_ai_ann", name: "lab-bulletin", type: "announcement", description: "Frontier model benchmarks and cluster updates." },
      { id: "chan_ai_1", name: "general", type: "text", description: "AI tooling, local Ollama models and LangChain/Next.js stacks." },
      { id: "chan_ai_2", name: "research-papers", type: "text", description: "ArXiv discussions on reasoning chains and mixture-of-agents." },
      { id: "chan_ai_voice", name: "Neural Jam Session", type: "voice", description: "Open audio discussion on agent architecture and loops." },
    ],
    comm_3: [
      { id: "chan_gc_ann", name: "campus-news", type: "announcement", description: "Global hackathons, grant applications and campus meetups." },
      { id: "chan_gc_1", name: "main-hall", type: "text", description: "General community banter and student intros." },
      { id: "chan_gc_2", name: "study-group", type: "text", description: "Algorithms and systems engineering." },
    ],
    comm_4: [
      { id: "chan_aud_1", name: "sound-stage", type: "text", description: "Ambient stems and spatial soundscapes." },
      { id: "chan_aud_voice", name: "Live Listening Party", type: "voice", description: "High-fidelity 48kHz audio room." },
    ],
  });

  const [activeChannelId, setActiveChannelId] = React.useState<string>("chan_1");

  // Direct Messages
  const [directMessages] = React.useState<DirectMessageUser[]>([
    {
      id: "dm_1",
      name: "Elena Rostova",
      username: "elena",
      avatar: "ER",
      status: "ONLINE",
      lastMessage: "The new spatial glass design looks stunning!",
    },
    {
      id: "dm_2",
      name: "Marcus Chen",
      username: "marcus",
      avatar: "MC",
      status: "IDLE",
      lastMessage: "Verified real-time sync across devices.",
    },
    {
      id: "dm_3",
      name: "Sophia Alvarez",
      username: "sophia",
      avatar: "SA",
      status: "DND",
      lastMessage: "Reviewing community permissions.",
    },
  ]);

  const [activeDmId, setActiveDmId] = React.useState<string>("dm_1");

  // Clean initial message feed (without junk/clutter demo text)
  const [messagesByRoom, setMessagesByRoom] = React.useState<Record<string, MessageItem[]>>({
    chan_1: [
      {
        id: "msg_init_1",
        senderName: "Elena Rostova",
        senderAvatar: "ER",
        content: "Welcome to #general! Feel free to share ideas and start chatting.",
        timestamp: "12:00",
        isSelf: false,
        reactions: [{ emoji: "👋", count: 2, hasReacted: true }],
      },
    ],
    chan_ann: [
      {
        id: "msg_init_ann",
        senderName: "Harsh (Platform Owner)",
        senderAvatar: "HA",
        content: "📢 Welcome to Lumina. Real-time channels and live audio stages are operational.",
        timestamp: "10:00",
        isSelf: true,
        isPinned: true,
      },
    ],
    dm_1: [
      {
        id: "msg_init_dm",
        senderName: "Elena Rostova",
        senderAvatar: "ER",
        content: "Hey! How is everything looking on your screen?",
        timestamp: "11:30",
        isSelf: false,
      },
    ],
  });

  // UI Interactive Controls
  const [messageInput, setMessageInput] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
  const [showNotifications, setShowNotifications] = React.useState<boolean>(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "notif_1",
      title: "Elena reacted to your message",
      description: "Added 👋 in #general",
      time: "10m ago",
      read: false,
    },
    {
      id: "notif_2",
      title: "Upcoming Community Plan",
      description: "Spatial UI Workshop is scheduled for tomorrow.",
      time: "1h ago",
      read: true,
    },
  ]);

  // Voice State
  const [isVoiceConnected, setIsVoiceConnected] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(false);

  // Modals
  const [isPollModalOpen, setIsPollModalOpen] = React.useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState<boolean>(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = React.useState<boolean>(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = React.useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState<boolean>(false);

  // Form Fields
  const [newChannelName, setNewChannelName] = React.useState<string>("");
  const [newChannelType, setNewChannelType] = React.useState<"text" | "announcement" | "voice">("text");
  const [newChannelDesc, setNewChannelDesc] = React.useState<string>("");

  const [newCommunityName, setNewCommunityName] = React.useState<string>("");
  const [newCommunityAvatar, setNewCommunityAvatar] = React.useState<string>("🚀");
  const [newCommunityDesc, setNewCommunityDesc] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Current Space Calculations
  const currentCommunity =
    communities.find((c) => c.id === activeCommunityId) || communities[0];
  const currentChannels = channelsByCommunity[activeCommunityId] || [];
  const currentChannel =
    currentChannels.find((ch) => ch.id === activeChannelId) || currentChannels[0] || {
      id: "chan_default",
      name: "general",
      type: "text" as const,
      description: "General channel",
    };

  const currentDm = directMessages.find((dm) => dm.id === activeDmId) || directMessages[0];
  const currentRoomKey = activeSection === "chats" ? activeDmId : currentChannel.id;
  const currentMessages = messagesByRoom[currentRoomKey] || [];

  // Filter messages by search query
  const filteredMessages = currentMessages.filter((m) =>
    searchQuery.trim()
      ? m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // ── REAL-TIME CHAT SYNC (Cross-Tab BroadcastChannel + API Polling) ──
  React.useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("lumina_live_chat");
      bc.onmessage = (event) => {
        if (event.data?.type === "NEW_MESSAGE" && event.data.roomKey) {
          const { roomKey, message } = event.data;
          setMessagesByRoom((prev) => {
            const list = prev[roomKey] || [];
            if (list.some((m) => m.id === message.id)) return prev;
            return { ...prev, [roomKey]: [...list, message] };
          });
        }
      };
    } catch {}

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?roomId=${currentRoomKey}`);
        const data = await res.json();
        if (data.success && data.data?.messages?.length > 0) {
          const serverMsgs: MessageItem[] = data.data.messages;
          setMessagesByRoom((prev) => {
            const existing = prev[currentRoomKey] || [];
            const merged = [...existing];
            for (const sm of serverMsgs) {
              if (!merged.some((m) => m.id === sm.id)) {
                merged.push({
                  ...sm,
                  isSelf: sm.senderName.startsWith(currentUser.displayName),
                });
              }
            }
            if (merged.length === existing.length) return prev;
            return { ...prev, [currentRoomKey]: merged };
          });
        }
      } catch {}
    }, 2000);

    return () => {
      clearInterval(interval);
      bc?.close();
    };
  }, [currentRoomKey, currentUser.displayName]);

  // Scroll to bottom on new message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length]);

  // Handlers
  const handleSelectCommunity = (commId: string) => {
    setActiveCommunityId(commId);
    const commChannels = channelsByCommunity[commId] || [];
    if (commChannels.length > 0) {
      setActiveChannelId(commChannels[0].id);
    }
    setIsMobileSidebarOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageInput.trim();
    if (!content) return;

    const newMsg: MessageItem = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderName: `${currentUser.displayName} (You)`,
      senderAvatar: currentUser.displayName.slice(0, 2).toUpperCase(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      reactions: [],
    };

    setMessagesByRoom((prev) => ({
      ...prev,
      [currentRoomKey]: [...(prev[currentRoomKey] || []), newMsg],
    }));

    setMessageInput("");
    setShowEmojiPicker(false);

    try {
      const bc = new BroadcastChannel("lumina_live_chat");
      bc.postMessage({ type: "NEW_MESSAGE", roomKey: currentRoomKey, message: newMsg });
      bc.close();
    } catch {}

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: currentRoomKey,
          content,
          senderName: currentUser.displayName,
          senderAvatar: currentUser.displayName.slice(0, 2).toUpperCase(),
        }),
      });
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith("image/");
    const newMsg: MessageItem = {
      id: `msg_file_${Date.now()}`,
      senderName: `${currentUser.displayName} (You)`,
      senderAvatar: currentUser.displayName.slice(0, 2).toUpperCase(),
      content: `Uploaded: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      attachment: {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: isImg ? "image" : "file",
        url: isImg ? URL.createObjectURL(file) : undefined,
      },
    };

    setMessagesByRoom((prev) => ({
      ...prev,
      [currentRoomKey]: [...(prev[currentRoomKey] || []), newMsg],
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddChannel = () => {
    if (!newChannelName.trim()) return;

    const slug = newChannelName.trim().toLowerCase().replace(/\s+/g, "-");
    const newChan: ChannelItem = {
      id: `chan_${Date.now()}`,
      name: slug,
      type: newChannelType,
      description: newChannelDesc.trim() || undefined,
    };

    setChannelsByCommunity((prev) => ({
      ...prev,
      [activeCommunityId]: [...(prev[activeCommunityId] || []), newChan],
    }));

    setActiveChannelId(newChan.id);
    setIsChannelModalOpen(false);
    setNewChannelName("");
    setNewChannelDesc("");
  };

  const handleAddCommunity = () => {
    if (!newCommunityName.trim()) return;

    const newId = `comm_${Date.now()}`;
    const newComm: CommunityItem = {
      id: newId,
      name: newCommunityName.trim(),
      avatar: newCommunityAvatar || "🌐",
      description: newCommunityDesc.trim() || "A new collaborative Lumina guild",
    };

    const initialChannels: ChannelItem[] = [
      { id: `chan_${newId}_gen`, name: "general", type: "text", description: "General discussion." },
      { id: `chan_${newId}_voice`, name: "Voice Stage", type: "voice", description: "Live audio stage." },
    ];

    setCommunities((prev) => [...prev, newComm]);
    setChannelsByCommunity((prev) => ({ ...prev, [newId]: initialChannels }));
    setActiveCommunityId(newId);
    setActiveChannelId(initialChannels[0].id);

    setIsCommunityModalOpen(false);
    setNewCommunityName("");
    setNewCommunityDesc("");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("lumina_user");
    } catch {}
    router.push("/login");
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex w-full h-full overflow-hidden select-none relative bg-canvas-dark text-text-primary">
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. Spatial Sidebar (Full desktop size on PC, sleek drawer on mobile) */}
      <SpatialSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setIsMobileSidebarOpen(false);
        }}
        communities={communities}
        activeCommunityId={activeCommunityId}
        onSelectCommunity={handleSelectCommunity}
        channels={currentChannels}
        activeChannelId={activeChannelId}
        onSelectChannel={(chId) => {
          setActiveChannelId(chId);
          setIsMobileSidebarOpen(false);
        }}
        directMessages={directMessages}
        activeDmId={activeDmId}
        onSelectDm={(dmId) => {
          setActiveDmId(dmId);
          setIsMobileSidebarOpen(false);
        }}
        onAddChannel={() => setIsChannelModalOpen(true)}
        onAddCommunity={() => setIsCommunityModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        userName={currentUser.displayName}
        userHandle={`@${currentUser.username}`}
        userStatus={currentUser.status}
        isOwner={true}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Spatial Canvas: Full-sized and spacious on Desktop! */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-canvas-light/60 dark:bg-canvas-dark/40 backdrop-blur-sm min-w-0">
        {/* Top Header: Full h-16 on desktop, compact on mobile */}
        <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-glass-border glass-panel z-20 flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            {/* Mobile Hamburger Drawer Trigger (only visible on mobile) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-spatial-xs bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary mr-1"
              title="Open Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {activeSection === "owner" ? (
              <div className="flex items-center gap-2 text-brand-rose">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm truncate">Security Command Center</span>
              </div>
            ) : activeSection === "plans" ? (
              <div className="flex items-center gap-2 text-brand-cyan">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm truncate">Community Planning & Events</span>
              </div>
            ) : activeSection === "chats" ? (
              <div className="flex items-center gap-2.5 text-text-primary overflow-hidden">
                <div className="w-6 h-6 rounded-spatial-xs bg-brand-indigo/20 text-brand-indigo flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {currentDm.avatar}
                </div>
                <span className="font-semibold text-sm truncate">{currentDm.name}</span>
                <span className="text-xs text-text-muted border-l border-glass-border pl-3 hidden sm:inline truncate">
                  Direct Conversation
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-text-primary overflow-hidden">
                {currentChannel.type === "voice" ? (
                  <Volume2 className="w-5 h-5 text-brand-emerald flex-shrink-0" />
                ) : currentChannel.type === "announcement" ? (
                  <Megaphone className="w-5 h-5 text-brand-amber flex-shrink-0" />
                ) : (
                  <Hash className="w-5 h-5 text-brand-indigo flex-shrink-0" />
                )}
                <span className="font-semibold text-sm md:text-base truncate">
                  {currentChannel.name}
                </span>
                {currentChannel.description && (
                  <span className="hidden sm:inline text-xs text-text-muted border-l border-glass-border pl-3 truncate">
                    {currentChannel.description}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Search Input */}
            <div className="w-40 md:w-48 hidden sm:block">
              <TranslucentInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                icon={<Search className="w-3.5 h-3.5" />}
                className="h-8 text-xs"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-spatial-sm glass-pill text-text-secondary hover:text-text-primary relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-rose ring-2 ring-canvas-dark animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-spatial-md glass-card-elevated border border-white/20 dark:border-white/10 shadow-glass-lg p-3 z-50 select-none"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-glass-border mb-2">
                      <span className="text-xs font-bold text-text-primary">Notifications</span>
                      <button
                        onClick={() =>
                          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                        }
                        className="text-[10px] text-brand-indigo hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-spatial-xs text-xs transition-colors ${
                            n.read ? "opacity-60" : "bg-white/5 font-medium"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-text-primary font-semibold text-[11px] truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-text-muted">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-text-secondary mt-0.5">{n.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Login / Account Link */}
            <button
              onClick={() => router.push("/login")}
              className="p-1.5 md:px-2.5 md:py-1.5 rounded-spatial-sm glass-pill text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Account"
            >
              <LogIn className="w-4 h-4 text-brand-indigo" />
              <span className="hidden sm:inline">Account</span>
            </button>
          </div>
        </header>

        {/* Dynamic Center Viewport Content */}
        {activeSection === "owner" ? (
          <OwnerDashboardPreview />
        ) : activeSection === "plans" ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  Upcoming Community Plans
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Scheduled events and reminders.
                </p>
              </div>
              <SpatialButton
                size="sm"
                onClick={() => setIsPlanModalOpen(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1.5" /> New Plan
              </SpatialButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InteractivePlanCard
                id="plan_1"
                title="Spatial UI & Glass Physics Workshop"
                description="Live architecture review, backdrop-filter optimization and spring dampeners."
                date="2026-09-24"
                time="18:00 UTC"
                location="Virtual Stage #01"
                organizerName="Harsh"
                attendeesCount={24}
              />

              <InteractivePlanCard
                id="plan_2"
                title="Cross-Platform Testing Sprint"
                description="Validating gesture sheets across mobile viewports."
                date="2026-09-27"
                time="15:30 UTC"
                location="Mobile Lab"
                organizerName="Elena Rostova"
                attendeesCount={12}
              />
            </div>
          </div>
        ) : currentChannel.type === "voice" && activeSection === "communities" ? (
          /* Voice Lounge Interactive Stage */
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
            <GlassCard variant="elevated" className="max-w-lg w-full p-8 space-y-6 flex flex-col items-center border-brand-emerald/30 shadow-glow-emerald">
              <div className="relative">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all ${isVoiceConnected ? "bg-brand-emerald/20 text-brand-emerald ring-8 ring-brand-emerald/20 animate-pulse" : "bg-white/10 text-text-muted"}`}>
                  <Radio className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                {isVoiceConnected && (
                  <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald text-white shadow-sm">
                    LIVE
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-text-primary tracking-tight">
                  {currentChannel.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {currentChannel.description || "Ultra-low latency 48kHz spatial audio lounge."}
                </p>
              </div>

              {/* Speaker Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 rounded-spatial-sm flex items-center justify-center font-bold text-sm border-2 ${isVoiceConnected ? "border-brand-emerald bg-brand-emerald/20 text-brand-emerald" : "border-white/10 bg-white/5 text-text-muted"}`}>
                    HA
                  </div>
                  <span className="text-[10px] text-text-muted">You</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-spatial-sm flex items-center justify-center font-bold text-sm border-2 border-brand-emerald/40 bg-brand-indigo/20 text-brand-indigo">
                    ER
                  </div>
                  <span className="text-[10px] text-text-muted">Elena</span>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="flex items-center gap-3 pt-4 border-t border-glass-border w-full justify-center">
                <SpatialButton
                  variant={isVoiceConnected ? "primary" : "secondary"}
                  size="md"
                  onClick={() => setIsVoiceConnected(!isVoiceConnected)}
                  className={isVoiceConnected ? "bg-brand-rose hover:bg-brand-rose/80 text-white" : ""}
                >
                  {isVoiceConnected ? (
                    <>
                      <PhoneOff className="w-4 h-4 mr-2" /> Disconnect
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 mr-2" /> Connect to Audio
                    </>
                  )}
                </SpatialButton>

                {isVoiceConnected && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-spatial-sm border transition-colors ${isMuted ? "bg-brand-rose/20 border-brand-rose/40 text-brand-rose" : "bg-white/10 border-white/15 text-text-primary hover:bg-white/15"}`}
                    title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </GlassCard>
          </div>
        ) : (
          /* Real-Time Message Stream & Feed */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-center opacity-60">
                  <Hash className="w-8 h-8 text-text-muted mb-2" />
                  <p className="text-sm font-semibold text-text-primary">Welcome to #{currentChannel.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Send a message to start the conversation.</p>
                </div>
              ) : (
                filteredMessages.map((m) => (
                  <div key={m.id} className="space-y-1.5">
                    <MessageBubble {...m} />
                    {m.attachment && (
                      <div className="ml-12 max-w-sm">
                        {m.attachment.type === "image" && m.attachment.url ? (
                          <div className="rounded-spatial-md overflow-hidden border border-white/20 shadow-glass-sm max-h-60">
                            <img
                              src={m.attachment.url}
                              alt={m.attachment.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="p-3 rounded-spatial-sm glass-panel flex items-center gap-3 border border-white/10 text-xs">
                            <FileText className="w-5 h-5 text-brand-indigo" />
                            <div className="overflow-hidden">
                              <p className="font-semibold text-text-primary truncate">{m.attachment.name}</p>
                              <span className="text-[10px] text-text-muted">{m.attachment.size}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Embedded Live Poll (Only in chan_1 for showcase) */}
              {currentChannel.id === "chan_1" && (
                <div className="px-2 md:px-4 py-2">
                  <InteractivePollCard
                    id="poll_live"
                    question="Which spatial lighting tone feels best for Lumina?"
                    creatorName="Elena Rostova"
                    options={[
                      { id: "opt_1", text: "Obsidian Cosmic Glass with Electric Indigo Glow", votes: 42 },
                      { id: "opt_2", text: "Pearl Frost Crystal with Specular Rim Highlights", votes: 19 },
                    ]}
                    totalVotes={61}
                    hasVotedId="opt_1"
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Translucent Chat Input Bar: Full on PC, sleek on mobile */}
            <div className="p-3 md:p-6 pb-20 md:pb-6 z-20 relative">
              {/* Quick Emoji Picker Strip */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-6 flex items-center gap-2 p-2 rounded-spatial-md glass-card-elevated border border-white/20 shadow-glass-lg z-30"
                  >
                    {["🚀", "🔥", "❤️", "👍", "✨", "🎉", "💡", "👏"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg p-1.5 hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center gap-2 p-2 rounded-spatial-lg glass-card-elevated border border-white/20 dark:border-white/10 shadow-glass-md"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-text-muted hover:text-text-primary rounded-spatial-sm hover:bg-white/10 transition-colors"
                  title="Attach Media or File"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message #${activeSection === "chats" ? currentDm.name : currentChannel.name}...`}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none px-2"
                />

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-spatial-sm hover:bg-white/10 transition-colors ${showEmojiPicker ? "text-brand-indigo" : "text-text-muted hover:text-text-primary"}`}
                  title="Add Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <SpatialButton
                  type="submit"
                  size="sm"
                  glow={true}
                  disabled={!messageInput.trim()}
                  className="h-9 px-3 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </SpatialButton>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 3. Desktop Context Inspector (Col 4) */}
      <ContextInspector
        activeCommunity={currentCommunity}
        activeChannel={currentChannel}
      />

      {/* 4. Mobile Floating Navigation Dock */}
      <FloatingDock
        activeTab={activeSection as any}
        onTabChange={(tab) => setActiveSection(tab as any)}
        isOwner={true}
      />

      {/* Modal: Create Community Poll */}
      <GlassModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        title="Create Community Poll"
        description="Launch an interactive single-choice poll with real-time spring animation bars."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Poll Question</label>
            <TranslucentInput placeholder="e.g. Which framework should we use?" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Option 1</label>
            <TranslucentInput placeholder="LiveKit Spatial Mesh" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Option 2</label>
            <TranslucentInput placeholder="Native MediaSoup SFU" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <SpatialButton variant="glass" size="sm" onClick={() => setIsPollModalOpen(false)}>
              Cancel
            </SpatialButton>
            <SpatialButton
              size="sm"
              onClick={() => {
                alert("Poll created!");
                setIsPollModalOpen(false);
              }}
            >
              Post Poll
            </SpatialButton>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Schedule Community Plan */}
      <GlassModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Schedule Community Plan"
        description="Create an event or meetup reminder with RSVP tracking."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Plan Title</label>
            <TranslucentInput placeholder="e.g. Design Systems Workshop" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Date & Time</label>
            <TranslucentInput placeholder="2026-09-28 • 18:00 UTC" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <SpatialButton variant="glass" size="sm" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </SpatialButton>
            <SpatialButton
              size="sm"
              onClick={() => {
                alert("Plan scheduled!");
                setIsPlanModalOpen(false);
              }}
            >
              Publish Plan
            </SpatialButton>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Create Channel */}
      <GlassModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        title="Create New Channel"
        description={`Add a new room to ${currentCommunity.name}.`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Channel Name</label>
            <TranslucentInput
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="e.g. sprint-demos"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Channel Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNewChannelType("text")}
                className={`p-2.5 rounded-spatial-sm border text-xs flex flex-col items-center gap-1 transition-colors ${newChannelType === "text" ? "border-brand-indigo bg-brand-indigo/15 text-white" : "border-glass-border hover:bg-white/5 text-text-secondary"}`}
              >
                <Hash className="w-4 h-4" />
                <span>Text</span>
              </button>

              <button
                type="button"
                onClick={() => setNewChannelType("announcement")}
                className={`p-2.5 rounded-spatial-sm border text-xs flex flex-col items-center gap-1 transition-colors ${newChannelType === "announcement" ? "border-brand-amber bg-brand-amber/15 text-white" : "border-glass-border hover:bg-white/5 text-text-secondary"}`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Notice</span>
              </button>

              <button
                type="button"
                onClick={() => setNewChannelType("voice")}
                className={`p-2.5 rounded-spatial-sm border text-xs flex flex-col items-center gap-1 transition-colors ${newChannelType === "voice" ? "border-brand-emerald bg-brand-emerald/15 text-white" : "border-glass-border hover:bg-white/5 text-text-secondary"}`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Voice</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <SpatialButton variant="glass" size="sm" onClick={() => setIsChannelModalOpen(false)}>
              Cancel
            </SpatialButton>
            <SpatialButton
              size="sm"
              disabled={!newChannelName.trim()}
              onClick={handleAddChannel}
            >
              Create Room
            </SpatialButton>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Create Community */}
      <GlassModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        title="Create Community Guild"
        description="Spawn a new spatial collective for your squad."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Guild Name</label>
            <TranslucentInput
              value={newCommunityName}
              onChange={(e) => setNewCommunityName(e.target.value)}
              placeholder="e.g. Quantum Computing Guild"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Avatar Emoji</label>
            <div className="flex items-center gap-2">
              {["🚀", "🧬", "🌐", "🤖", "🪐", "💎", "🔥", "🔮"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewCommunityAvatar(emoji)}
                  className={`text-xl p-2 rounded-spatial-xs border transition-transform ${newCommunityAvatar === emoji ? "border-brand-indigo bg-brand-indigo/20 scale-110" : "border-glass-border hover:bg-white/5"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <SpatialButton variant="glass" size="sm" onClick={() => setIsCommunityModalOpen(false)}>
              Cancel
            </SpatialButton>
            <SpatialButton
              size="sm"
              disabled={!newCommunityName.trim()}
              onClick={handleAddCommunity}
            >
              Create Guild
            </SpatialButton>
          </div>
        </div>
      </GlassModal>

      {/* Modal: User Profile & Spatial Preferences */}
      <GlassModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Spatial Account & Preferences"
        description="Configure your status presence and display profile."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Display Name</label>
            <TranslucentInput
              value={currentUser.displayName}
              onChange={(e) => setCurrentUser((p) => ({ ...p, displayName: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Handle</label>
            <TranslucentInput
              value={currentUser.username}
              onChange={(e) => setCurrentUser((p) => ({ ...p, username: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Presence Status</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { status: "ONLINE", label: "Online" },
                { status: "IDLE", label: "Idle / Away" },
                { status: "DND", label: "Do Not Disturb" },
                { status: "OFFLINE", label: "Invisible" },
              ].map((item) => (
                <button
                  key={item.status}
                  type="button"
                  onClick={() =>
                    setCurrentUser((p) => ({ ...p, status: item.status as PresenceStatus }))
                  }
                  className={`p-2 rounded-spatial-sm border text-xs flex items-center justify-between transition-colors ${
                    currentUser.status === item.status
                      ? "border-brand-indigo bg-brand-indigo/15 text-white"
                      : "border-glass-border hover:bg-white/5 text-text-secondary"
                  }`}
                >
                  <span>{item.label}</span>
                  {currentUser.status === item.status && <Check className="w-3.5 h-3.5 text-brand-indigo" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-glass-border">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-brand-rose hover:underline flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out / Switch User
            </button>

            <SpatialButton size="sm" onClick={() => setIsSettingsModalOpen(false)}>
              Save Preferences
            </SpatialButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
