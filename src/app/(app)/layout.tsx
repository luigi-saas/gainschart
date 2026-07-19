"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading, configured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!configured || !user) return null;

  const TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/sport": "Sport",
    "/savings": "Savings",
    "/history": "History",
    "/profile": "Profile",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold" style={{ color: "var(--t1)" }}>
            {TITLES[pathname] ?? "Budget & Sport"}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--t3)" }}>
            Hi, {profile?.displayName || "there"} 👋
          </p>
        </div>
      </header>

      {/* Page content — extra bottom padding for the floating nav */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-36">
        <div className="animate-fadeIn">{children}</div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
