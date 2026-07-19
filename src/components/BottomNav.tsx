"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, PiggyBank, Clock, User } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Budget" },
  { href: "/sport",     icon: Dumbbell,        label: "Sport" },
  { href: "/savings",   icon: PiggyBank,       label: "Savings" },
  { href: "/history",   icon: Clock,           label: "History" },
  { href: "/profile",   icon: User,            label: "Profile" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 right-0 z-50"
      style={{ bottom: "1.5rem", padding: "0 1rem" }}
    >
      <div
        className="max-w-md mx-auto flex items-center justify-around py-1.5"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          borderRadius: "var(--r-card)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 tap"
              style={{ minWidth: 52 }}
            >
              {/* active dot */}
              {active && (
                <span
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}

              <span
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: active ? "var(--accent)" : "transparent",
                  transform: active ? "scale(1.1)" : "scale(1)",
                  boxShadow: active
                    ? "0 4px 12px rgba(238,193,160,0.45)"
                    : "none",
                }}
              >
                <Icon
                  className="w-[22px] h-[22px] transition-colors duration-200"
                  style={{ color: active ? "var(--accent-ink)" : "var(--t3)" }}
                />
              </span>

              <span
                className="text-[10px] font-semibold transition-colors duration-200"
                style={{ color: active ? "var(--accent-dim)" : "var(--t3)" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
