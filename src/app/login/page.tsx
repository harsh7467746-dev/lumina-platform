"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpatialButton } from "@/components/ui/SpatialButton";
import { TranslucentInput } from "@/components/ui/TranslucentInput";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Form Fields
  const [identifier, setIdentifier] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [regUsername, setRegUsername] = React.useState<string>("");
  const [regDisplayName, setRegDisplayName] = React.useState<string>("");
  const [regEmail, setRegEmail] = React.useState<string>("");
  const [regPassword, setRegPassword] = React.useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Invalid username/email or password.");
      }

      setSuccess("Authenticated successfully! Redirecting...");
      if (data.data?.user) {
        localStorage.setItem("lumina_user", JSON.stringify(data.data.user));
      }
      setTimeout(() => router.push("/"), 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          displayName: regDisplayName.trim() || regUsername.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.error?.code === "CONFLICT") {
          throw new Error(data.error?.message || "An account with this username or email already exists.");
        }
        throw new Error(data.error?.message || "Registration failed. Please check your inputs.");
      }

      setSuccess("Account created successfully! Redirecting to space...");
      if (data.data?.user) {
        localStorage.setItem("lumina_user", JSON.stringify(data.data.user));
      }
      setTimeout(() => router.push("/"), 900);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-canvas-dark select-none">
      {/* Background ambient lighting */}
      <div className="ambient-glow-bg pointer-events-none">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard variant="elevated" className="p-6 md:p-8 space-y-6 border-white/15 shadow-glass-xl backdrop-blur-2xl">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-spatial-sm bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-glow-indigo mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {mode === "login" ? "Welcome Back to Lumina" : "Create Lumina Account"}
            </h1>
            <p className="text-xs text-text-secondary">
              {mode === "login"
                ? "Enter your credentials to enter your spatial communities."
                : "Join the next-generation spatial collective."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-1 rounded-spatial-sm bg-white/5 border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-1.5 rounded-spatial-xs text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-1.5 rounded-spatial-xs text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-brand-indigo text-white shadow-glass-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 rounded-spatial-sm bg-brand-rose/15 border border-brand-rose/30 text-brand-rose flex items-start gap-2.5 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 rounded-spatial-sm bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-start gap-2.5 text-xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Username or Email</label>
                <TranslucentInput
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. harsh or harsh@lumina.io"
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Password</label>
                <TranslucentInput
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>

              <SpatialButton
                type="submit"
                disabled={loading || !identifier.trim() || !password}
                className="w-full h-10 text-xs font-semibold mt-2"
                glow
              >
                {loading ? "Authenticating..." : "Sign In to Lumina"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </SpatialButton>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Unique Username</label>
                <TranslucentInput
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. harsh_dev"
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Display Name</label>
                <TranslucentInput
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  placeholder="e.g. Harsh (Developer)"
                  icon={<Sparkles className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Email Address</label>
                <TranslucentInput
                  required
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@domain.com"
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Password (Min 8 chars)</label>
                <TranslucentInput
                  required
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>

              <SpatialButton
                type="submit"
                disabled={loading || !regUsername.trim() || !regEmail.trim() || regPassword.length < 8}
                className="w-full h-10 text-xs font-semibold mt-2"
                glow
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </SpatialButton>
            </form>
          )}

          {/* Quick guest bypass */}
          <div className="pt-2 text-center border-t border-glass-border">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Skip for now & enter as Guest →
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
