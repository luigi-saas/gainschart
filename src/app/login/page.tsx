"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, configured, signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || email.split("@")[0]);
      }
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/user-not-found" || msg === "auth/wrong-password" || msg === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (msg === "auth/email-already-in-use") {
        setError("Email already registered");
      } else if (msg === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else {
        setError((err as Error).message || "Something went wrong");
      }
    }
    setBusy(false);
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Google sign-in failed");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm glass p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--warn-tint)" }}>
            <DollarSign className="w-8 h-8" style={{ color: "var(--warn)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--t1)" }}>Firebase Not Configured</h1>
          <p className="text-sm mt-2" style={{ color: "var(--t3)" }}>
            Copy <code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--surface-2)" }}>.env.example</code>{" "}
            to <code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--surface-2)" }}>.env</code> and fill in your Firebase keys.
          </p>
          <div className="mt-4 text-left text-[11px] p-3 rounded-xl font-mono leading-relaxed"
            style={{ background: "var(--surface-2)", color: "var(--t2)" }}>
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

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center pulse-glow"
            style={{ background: "var(--accent)" }}>
            <DollarSign className="w-10 h-10" style={{ color: "var(--accent-ink)" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--t1)" }}>Budget &amp; Sport</h1>
          <p className="text-sm mt-1" style={{ color: "var(--t3)" }}>Track your finances &amp; fitness</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 text-sm font-medium"
              style={{ background: "var(--bad-tint)", color: "var(--bad)", borderRadius: "var(--r-field)" }}>
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name" className="field pl-11" />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" className="field pl-11" required />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--t3)" }} />
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" className="field pl-11 pr-11" required minLength={6} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPw
                ? <EyeOff className="w-5 h-5" style={{ color: "var(--t3)" }} />
                : <Eye className="w-5 h-5" style={{ color: "var(--t3)" }} />}
            </button>
          </div>

          <button type="submit" disabled={busy}
            className="w-full py-3.5 font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 tap"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--r-field)", boxShadow: "var(--shadow-btn)" }}>
            {busy
              ? <div className="w-5 h-5 mx-auto rounded-full border-2 animate-spin"
                  style={{ borderColor: "var(--accent-ink)", borderTopColor: "transparent" }} />
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border-2)" }} />
            <span className="text-xs" style={{ color: "var(--t3)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-2)" }} />
          </div>

          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={busy}
            className="w-full py-3 font-medium text-sm tap flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--surface-2)", color: "var(--t1)", borderRadius: "var(--r-field)", border: "1px solid var(--border-2)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 015.5 12c0-.72.13-1.43.35-2.09V7.07H2.18A11.02 11.02 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* toggle */}
          <p className="text-center text-sm" style={{ color: "var(--t3)" }}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="font-semibold" style={{ color: "var(--accent-dim)" }}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
