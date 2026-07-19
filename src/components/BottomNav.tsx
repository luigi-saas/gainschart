"use client";

import { LayoutDashboard, Dumbbell, PiggyBank, Clock, User } from "lucide-react";

export type TabId = "dashboard" | "sport" | "savings" | "history" | "profile";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Budget" },
  { id: "sport", icon: Dumbbell, label: "Sport" },
  { id: "savings", icon: PiggyBank, label: "Savings" },
  { id: "history", icon: Clock, label: "History" },
  { id: "profile", icon: User, label: "Profile" },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed left-0 right-0 z-50"
      style={{
        bottom: "1.5rem",
        padding: "0 1rem",
      }}
    >
      <div
        className="max-w-md mx-auto flex items-center justify-around py-2"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "var(--r-card)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 transition-all duration-200 tap"
              style={{ minWidth: "56px" }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  boxShadow: isActive ? "0 4px 12px rgba(238, 193, 160, 0.4)" : "none",
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--accent-ink)" : "var(--t3)",
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{
                  color: isActive ? "var(--accent-dim)" : "var(--t3)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
