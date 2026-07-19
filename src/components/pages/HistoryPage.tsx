"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock, Search, Filter, ShoppingCart, Car, UtensilsCrossed,
  Gamepad2, Heart, Users, ShoppingBag, GraduationCap, CircleDot,
  Building2, Activity, Wifi, Smartphone, Shield, CreditCard,
  TrendingDown, Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getAllExpenses, type VariableExpense, type FixedExpense } from "@/lib/firestore";
import { formatCurrency, CAT_COLOR } from "@/lib/constants";

const CAT_ICONS: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Restaurants: <UtensilsCrossed className="w-4 h-4" />,
  Entertainment: <Gamepad2 className="w-4 h-4" />,
  Beauty: <Heart className="w-4 h-4" />,
  Family: <Users className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Education: <GraduationCap className="w-4 h-4" />,
  Other: <CircleDot className="w-4 h-4" />,
  Rent: <Building2 className="w-4 h-4" />,
  Utilities: <Activity className="w-4 h-4" />,
  Internet: <Wifi className="w-4 h-4" />,
  Phone: <Smartphone className="w-4 h-4" />,
  Insurance: <Shield className="w-4 h-4" />,
  Subscriptions: <CreditCard className="w-4 h-4" />,
};

type ExpenseWithKind = (VariableExpense | FixedExpense) & { kind?: string };

export default function HistoryPage() {
  const { user, profile } = useAuth();
  const currency = profile?.currency || "USD";
  const [expenses, setExpenses] = useState<ExpenseWithKind[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "variable" | "fixed">("all");

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllExpenses(user.uid);
      setExpenses(data);
    } catch (e) {
      console.error("Error fetching expenses:", e);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // Filter expenses
  const filtered = expenses.filter(e => {
    if (filterType === "variable" && e.kind !== "variable") return false;
    if (filterType === "fixed" && e.kind !== "fixed") return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by date/month
  const groupedByMonth: Record<string, ExpenseWithKind[]> = {};
  filtered.forEach(e => {
    const date = 'date' in e ? e.date : e.createdAt.slice(0, 10);
    const monthKey = date.slice(0, 7);
    if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
    groupedByMonth[monthKey].push(e);
  });

  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  // Stats
  const totalSpent = filtered.reduce((s, e) => s + e.amount, 0);
  const avgPerTransaction = filtered.length > 0 ? totalSpent / filtered.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" style={{ color: "var(--bad)" }} />
            <span className="text-xs" style={{ color: "var(--t3)" }}>Total Spent</span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--t1)" }}>
            {formatCurrency(totalSpent, currency)}
          </p>
        </div>
        <div className="glass p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ color: "var(--t3)" }}>Transactions</span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--t1)" }}>{filtered.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--t3)" }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="field pl-10"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "variable", "fixed"] as const).map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              className="px-3 py-1.5 text-xs font-medium tap capitalize"
              style={{
                background: filterType === type ? "var(--accent)" : "var(--surface-2)",
                color: filterType === type ? "var(--accent-ink)" : "var(--t2)",
                borderRadius: "var(--r-pill)",
                border: "1px solid " + (filterType === type ? "var(--accent)" : "var(--border-2)"),
              }}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions by Month */}
      {filtered.length === 0 ? (
        <div className="glass p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "var(--accent-tint)" }}>
            <Clock className="w-8 h-8" style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--t1)" }}>No transactions found</p>
          <p className="text-xs mt-1" style={{ color: "var(--t3)" }}>
            {search ? "Try a different search term" : "Start tracking your expenses!"}
          </p>
        </div>
      ) : (
        sortedMonths.map(monthKey => {
          const monthExpenses = groupedByMonth[monthKey];
          const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
          const [year, month] = monthKey.split("-");
          const monthLabel = new Date(parseInt(year), parseInt(month) - 1, 1)
            .toLocaleDateString("en-US", { month: "long", year: "numeric" });

          return (
            <div key={monthKey} className="glass overflow-hidden">
              <div className="flex items-center justify-between p-4"
                style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="font-semibold text-sm" style={{ color: "var(--t1)" }}>{monthLabel}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--accent-dim)" }}>
                  {formatCurrency(monthTotal, currency)}
                </span>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {monthExpenses.map(e => {
                  const color = CAT_COLOR[e.type] || "#8A8175";
                  const date = 'date' in e ? e.date : e.createdAt.slice(0, 10);
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: color + "20", color }}>
                        {CAT_ICONS[e.type] || <CircleDot className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--t1)" }}>{e.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: "var(--t3)" }}>{e.type}</span>
                          <span className="text-[10px]" style={{ color: "var(--t3)" }}>·</span>
                          <span className="text-[10px]" style={{ color: "var(--t3)" }}>{date}</span>
                          <span className="text-[9px] px-1.5 py-0.5 font-medium"
                            style={{
                              background: e.kind === "fixed" ? "var(--warn-tint)" : "var(--accent-tint)",
                              color: e.kind === "fixed" ? "var(--warn)" : "var(--accent-dim)",
                              borderRadius: "var(--r-pill)",
                            }}>
                            {e.kind}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--t1)" }}>
                        -{formatCurrency(e.amount, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
