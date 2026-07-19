"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Search, TrendingDown, Calendar, ShoppingCart, Car, UtensilsCrossed, Gamepad2, Heart, Users, ShoppingBag, GraduationCap, CircleDot, Building2, Activity, Wifi, Smartphone, Shield, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getAllExpenses, type VariableExpense, type FixedExpense } from "@/lib/firestore";
import { formatCurrency, CAT_COLOR } from "@/lib/constants";

const CAT_ICONS: Record<string, React.ReactNode> = {
  Groceries:<ShoppingCart className="w-4 h-4"/>,Transport:<Car className="w-4 h-4"/>,Restaurants:<UtensilsCrossed className="w-4 h-4"/>,Entertainment:<Gamepad2 className="w-4 h-4"/>,Beauty:<Heart className="w-4 h-4"/>,Family:<Users className="w-4 h-4"/>,Shopping:<ShoppingBag className="w-4 h-4"/>,Health:<Heart className="w-4 h-4"/>,Education:<GraduationCap className="w-4 h-4"/>,Other:<CircleDot className="w-4 h-4"/>,Rent:<Building2 className="w-4 h-4"/>,Utilities:<Activity className="w-4 h-4"/>,Internet:<Wifi className="w-4 h-4"/>,Phone:<Smartphone className="w-4 h-4"/>,Insurance:<Shield className="w-4 h-4"/>,Subscriptions:<CreditCard className="w-4 h-4"/>,
};

type Exp = (VariableExpense | FixedExpense) & { kind?: string };

export default function HistoryPage() {
  const { user, profile } = useAuth();
  const currency = profile?.currency || "USD";
  const [expenses, setExpenses] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"variable"|"fixed">("all");

  const fetch_ = useCallback(async () => { if (!user) return; setLoading(true); try { setExpenses(await getAllExpenses(user.uid)); } catch(e){ console.error(e); } setLoading(false); }, [user]);
  useEffect(() => { fetch_(); }, [fetch_]);

  const filtered = expenses.filter(e => {
    if (filter==="variable" && e.kind!=="variable") return false;
    if (filter==="fixed" && e.kind!=="fixed") return false;
    if (search) { const q=search.toLowerCase(); return e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q); }
    return true;
  });

  const byMonth: Record<string, Exp[]> = {};
  filtered.forEach(e => { const d="date" in e ? e.date : e.createdAt.slice(0,10); const m=d.slice(0,7); (byMonth[m]??=[]).push(e); });
  const months = Object.keys(byMonth).sort((a,b) => b.localeCompare(a));
  const totalSpent = filtered.reduce((s,e) => s+e.amount, 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-3 animate-spin" style={{ borderColor:"var(--accent)", borderTopColor:"transparent" }}/></div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 space-y-2"><div className="flex items-center gap-2"><TrendingDown className="w-5 h-5" style={{ color:"var(--bad)" }}/><span className="text-xs" style={{ color:"var(--t3)" }}>Total Spent</span></div><p className="text-xl font-bold" style={{ color:"var(--t1)" }}>{formatCurrency(totalSpent,currency)}</p></div>
        <div className="glass p-4 space-y-2"><div className="flex items-center gap-2"><Clock className="w-5 h-5" style={{ color:"var(--accent)" }}/><span className="text-xs" style={{ color:"var(--t3)" }}>Transactions</span></div><p className="text-xl font-bold" style={{ color:"var(--t1)" }}>{filtered.length}</p></div>
      </div>

      <div className="space-y-3">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"var(--t3)" }}/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="field pl-10"/></div>
        <div className="flex gap-2">{(["all","variable","fixed"] as const).map(t=>(<button key={t} onClick={()=>setFilter(t)} className="px-3 py-1.5 text-xs font-medium tap capitalize" style={{ background:filter===t?"var(--accent)":"var(--surface-2)", color:filter===t?"var(--accent-ink)":"var(--t2)", borderRadius:"var(--r-pill)", border:"1px solid "+(filter===t?"var(--accent)":"var(--border-2)") }}>{t}</button>))}</div>
      </div>

      {filtered.length===0 ? (<div className="glass p-8 text-center"><div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background:"var(--accent-tint)" }}><Clock className="w-8 h-8" style={{ color:"var(--accent)" }}/></div><p className="text-sm font-medium" style={{ color:"var(--t1)" }}>No transactions</p></div>)
      : months.map(mk => {
        const list = byMonth[mk]; const total = list.reduce((s,e) => s+e.amount, 0);
        const [y,m] = mk.split("-");
        const label = new Date(parseInt(y), parseInt(m)-1, 1).toLocaleDateString("en-US", { month:"long", year:"numeric" });
        return (<div key={mk} className="glass overflow-hidden">
          <div className="flex items-center justify-between p-4" style={{ background:"var(--surface-2)", borderBottom:"1px solid var(--border)" }}><div className="flex items-center gap-2"><Calendar className="w-4 h-4" style={{ color:"var(--accent)" }}/><span className="font-semibold text-sm" style={{ color:"var(--t1)" }}>{label}</span></div><span className="text-sm font-bold" style={{ color:"var(--accent-dim)" }}>{formatCurrency(total,currency)}</span></div>
          <div className="divide-y" style={{ borderColor:"var(--border)" }}>{list.map(e => {
            const c = CAT_COLOR[e.type]||"#8A8175"; const date = "date" in e ? e.date : e.createdAt.slice(0,10);
            return (<div key={e.id} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:c+"20", color:c }}>{CAT_ICONS[e.type]||<CircleDot className="w-4 h-4"/>}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color:"var(--t1)" }}>{e.name}</p><div className="flex items-center gap-2"><span className="text-[10px]" style={{ color:"var(--t3)" }}>{e.type}</span><span className="text-[10px]" style={{ color:"var(--t3)" }}>·</span><span className="text-[10px]" style={{ color:"var(--t3)" }}>{date}</span><span className="text-[9px] px-1.5 py-0.5 font-medium" style={{ background:e.kind==="fixed"?"var(--warn-tint)":"var(--accent-tint)", color:e.kind==="fixed"?"var(--warn)":"var(--accent-dim)", borderRadius:"var(--r-pill)" }}>{e.kind}</span></div></div>
              <span className="text-sm font-semibold" style={{ color:"var(--t1)" }}>-{formatCurrency(e.amount,currency)}</span>
            </div>);
          })}</div>
        </div>);
      })}
    </div>
  );
}
