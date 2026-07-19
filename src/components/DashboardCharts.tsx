"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from "recharts";
import { CAT_COLOR } from "@/lib/constants";

interface VarExpense { type: string; amount: number; }
interface FixExpense { type: string; amount: number; }

const CHART_COLORS = [
  "#EEC1A0", "#D6A75C", "#7B9E8E", "#C9695A", "#B9925A",
  "#C98A8F", "#8FA37E", "#5FA97A", "#8A8175", "#6C63FF",
];

function fmtVal(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value) || 0;
  return `$${n.toFixed(2)}`;
}

export function SpendingPieChart({ varExpenses, fixExpenses }: { varExpenses: VarExpense[]; fixExpenses: FixExpense[] }) {
  const categoryTotals: Record<string, number> = {};
  [...varExpenses, ...fixExpenses].forEach(e => {
    categoryTotals[e.type] = (categoryTotals[e.type] || 0) + e.amount;
  });
  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--t3)" }}>
        No expenses to chart yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
            paddingAngle={2} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CAT_COLOR[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={fmtVal} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-1.5">
        {data.slice(0, 6).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full shrink-0"
              style={{ background: CAT_COLOR[d.name] || CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="truncate" style={{ color: "var(--t2)" }}>{d.name}</span>
            <span className="ml-auto font-medium" style={{ color: "var(--t1)" }}>${d.value.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetBarChart({ totalBudget, totalSpent, remaining }: {
  totalBudget: number; totalSpent: number; remaining: number;
}) {
  const data = [
    { name: "Budget", value: totalBudget, fill: "var(--accent)" },
    { name: "Spent", value: totalSpent, fill: totalSpent > totalBudget ? "var(--bad)" : "var(--warn)" },
    { name: "Left", value: Math.max(0, remaining), fill: "var(--good)" },
  ];

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barGap={8}>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--t3)" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip formatter={fmtVal} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SpendingTrendChart({ expenses }: { expenses: { date: string; amount: number }[] }) {
  const dayTotals: Record<string, number> = {};
  expenses.forEach(e => {
    const day = e.date.slice(8, 10);
    dayTotals[day] = (dayTotals[day] || 0) + e.amount;
  });

  const data = Object.entries(dayTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, amount]) => ({ day: `Day ${parseInt(day)}`, amount: Math.round(amount * 100) / 100 }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm" style={{ color: "var(--t3)" }}>
        No spending data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--t3)" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip formatter={fmtVal} />
        <Area type="monotone" dataKey="amount" stroke="var(--accent)" fill="var(--accent-tint)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
