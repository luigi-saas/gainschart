"use client";

import { useState } from "react";
import { DollarSign, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import BottomNav, { type TabId } from "@/components/BottomNav";
import DashboardPage from "@/components/pages/DashboardPage";
import SportPage from "@/components/pages/SportPage";
import SavingsPage from "@/components/pages/SavingsPage";
import HistoryPage from "@/components/pages/HistoryPage";
import ProfilePage from "@/components/pages/ProfilePage";

function AppContent() {
  const { user, profile, loading, configured, signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || email.split("@")[0]);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setAuthError(error.message || "Authentication failed");
    }
    setAuthLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setAuthError(error.message || "Google sign-in failed");
    }
    setAuthLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // Firebase not configured
  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm glass p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--warn-tint)" }}>
            <DollarSign className="w-8 h-8" style={{ color: "var(--warn)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--t1)" }}>Firebase Not Configured</h1>
          <p className="text-sm mt-2" style={{ color: "var(--t3)" }}>
            Add your Firebase config to <code className="text-xs bg-black/5 px-1 py-0.5 rounded">.env.local</code>
          </p>
          <div className="mt-4 text-left text-xs p-3 rounded-lg font-mono" style={{ background: "var(--surface-2)", color: "var(--t2)" }}>
            NEXT_PUBLIC_FIREBASE_API_KEY=<br />
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<br />
            NEXT_PUBLIC_FIREBASE_PROJECT_ID=<br />
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<br />
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<br />
            NEXT_PUBLIC_FIREBASE_APP_ID=
          </div>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center pulse-glow"
              style={{ background: "var(--accent)" }}>
              <DollarSign className="w-10 h-10" style={{ color: "var(--accent-ink)" }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--t1)" }}>Budget & Sport</h1>
            <p className="text-sm mt-1" style={{ color: "var(--t3)" }}>
              Track your finances & fitness
            </p>
          </div>

          {/* Auth Form */}
          <div className="glass p-6 space-y-4">
            {authError && (
              <div className="px-4 py-3 text-sm font-medium"
                style={{ background: "var(--bad-tint)", color: "var(--bad)", borderRadius: "var(--r-field)" }}>
                {authError}
              </div>
            )}

            {authMode === "register" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="field pl-11"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="field pl-11"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="field pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: "var(--t3)" }} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: "var(--t3)" }} />
                )}
              </button>
            </div>

            <button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full py-3.5 font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 tap"
              style={{
                background: "var(--accent)",
                color: "var(--accent-ink)",
                borderRadius: "var(--r-field)",
                boxShadow: "var(--shadow-btn)",
              }}
            >
              {authLoading ? (
                <div className="w-5 h-5 mx-auto rounded-full border-2 animate-spin"
                  style={{ borderColor: "var(--accent-ink)", borderTopColor: "transparent" }} />
              ) : authMode === "login" ? "Sign In" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border-2)" }} />
              <span className="text-xs" style={{ color: "var(--t3)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "var(--border-2)" }} />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full py-3 font-medium text-sm transition hover:opacity-90 disabled:opacity-50 tap flex items-center justify-center gap-2"
              style={{
                background: "var(--surface-2)",
                color: "var(--t1)",
                borderRadius: "var(--r-field)",
                border: "1px solid var(--border-2)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Toggle auth mode */}
            <p className="text-center text-sm" style={{ color: "var(--t3)" }}>
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}
                className="font-semibold"
                style={{ color: "var(--accent-dim)" }}
              >
                {authMode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--t1)" }}>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "sport" && "Sport"}
              {activeTab === "savings" && "Savings"}
              {activeTab === "history" && "History"}
              {activeTab === "profile" && "Profile"}
            </h1>
            <p className="text-xs" style={{ color: "var(--t3)" }}>
              Hi, {profile?.displayName || "there"} 👋
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-32">
        <div className="animate-fadeIn">
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "sport" && <SportPage />}
          {activeTab === "savings" && <SavingsPage />}
          {activeTab === "history" && <HistoryPage />}
          {activeTab === "profile" && <ProfilePage />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
