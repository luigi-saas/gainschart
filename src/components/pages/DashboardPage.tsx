"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, ChevronLeft, ChevronRight, Wallet, Home, Landmark,
  TrendingUp, DollarSign, Activity, PieChart, BarChart3,
  ShoppingCart, Car, UtensilsCrossed, Gamepad2, Heart, Users,
  ShoppingBag, GraduationCap, CircleDot, Building2, Wifi, Smartphone,
  Shield, CreditCard, Trash2,
} from "lucide-react";
import Modal, { Field, SelectField, BtnPrimary } from "@/components/Modal";
import { SpendingPieChart, BudgetBarChart, SpendingTrendChart } from "@/components/DashboardCharts";
import { useAuth } from "@/lib/auth-context";
import {
  getBudget, createBudget, getVariableExpenses, getFixedExpenses,
  addVariableExpense, addFixedExpense, deleteVariableExpense, deleteFixedExpense,
  type MonthBudget, type VariableExpense, type FixedExpense,
} from "@/lib/firestore";
import {
  VARIABLE_TYPES, FIXED_TYPES, CAT_COLOR,
  formatCurrency, currentMonthId, monthLabel, prevMonthId, nextMonthId,
} from "@/lib/constants";

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

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const currency = profile?.currency || "USD";

  const [monthId, setMonthId] = useState(currentMonthId());
  const [budget, setBudget] = useState<MonthBudget | null>(null);
  const [varExpenses, setVarExpenses] = useState<VariableExpense[]>([]);
  const [fixExpenses, setFixExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSetup, setShowSetup] = useState(false);
  const [showAddVar, setShowAddVar] = useState(false);
  const [showAddFix, setShowAddFix] = useState(false);

  // Form states
  const [setupTotal, setSetupTotal] = useState("");
  const [setupHome, setSetupHome] = useState("");
  const [setupWallet, setSetupWallet] = useState("");
  const [setupBank, setSetupBank] = useState("");
  const [expName, setExpName] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expType, setExpType] = useState<string>(VARIABLE_TYPES[0]);
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [fixName, setFixName] = useState("");
  const [fixAmount, setFixAmount] = useState("");
  const [fixType, setFixType] = useState<string>(FIXED_TYPES[0]);
  const [fixBase, setFixBase] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [b, vExp, fExp] = await Promise.all([
        getBudget(user.uid, monthId),
        getVariableExpenses(user.uid, monthId),
        getFixedExpenses(user.uid, monthId),
      ]);
      setBudget(b);
      setVarExpenses(vExp);
      setFixExpenses(fExp);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
    setLoading(false);
  }, [user, monthId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateBudget = async () => {
    if (!user) return;
    await createBudget({
      userId: user.uid,
      monthId,
      totalBudget: parseFloat(setupTotal) || 0,
      homePart: parseFloat(setupHome) || 0,
      walletPart: parseFloat(setupWallet) || 0,
      bankPart: parseFloat(setupBank) || 0,
      createdAt: new Date().toISOString(),
    });
    setShowSetup(false);
    setSetupTotal(""); setSetupHome(""); setSetupWallet(""); setSetupBank("");
    fetchData();
  };

  const handleAddVar = async () => {
    if (!user) return;
    await addVariableExpense({
      userId: user.uid,
      monthId,
      name: expName,
      amount: parseFloat(expAmount) || 0,
      type: expType,
      date: expDate,
      createdAt: new Date().toISOString(),
    });
    setShowAddVar(false);
    setExpName(""); setExpAmount(""); setExpType(VARIABLE_TYPES[0]); setExpDate(new Date().toISOString().slice(0, 10));
    fetchData();
  };

  const handleAddFix = async () => {
    if (!user) return;
    await addFixedExpense({
      userId: user.uid,
      monthId,
      name: fixName,
      amount: parseFloat(fixAmount) || 0,
      type: fixType,
      base: parseFloat(fixBase) || 0,
      createdAt: new Date().toISOString(),
    });
    setShowAddFix(false);
    setFixName(""); setFixAmount(""); setFixType(FIXED_TYPES[0]); setFixBase("");
    fetchData();
  };

  const handleDeleteVar = async (id: string) => {
    await deleteVariableExpense(id);
    fetchData();
  };

  const handleDeleteFix = async (id: string) => {
    await deleteFixedExpense(id);
    fetchData();
  };

  // Computed values
  const totalVarSpent = varExpenses.reduce((s, e) => s + e.amount, 0);
  const totalFixSpent = fixExpenses.reduce((s, e) => s + e.amount, 0);
  const totalSpent = totalVarSpent + totalFixSpent;
  const remaining = (budget?.totalBudget || 0) - totalSpent;
  const spentPct = budget?.totalBudget ? Math.min((totalSpent / budget.totalBudget) * 100, 100) : 0;

  // Group var expenses by category
  const varByCategory: Record<string, VariableExpense[]> = {};
  varExpenses.forEach(e => {
    if (!varByCategory[e.type]) varByCategory[e.type] = [];
    varByCategory[e.type].push(e);
  });

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
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMonthId(prevMonthId(monthId))} className="tap p-2.5 rounded-full"
          style={{ background: "var(--surface-2)" }}>
          <ChevronLeft className="w-5 h-5" style={{ color: "var(--t2)" }} />
        </button>
        <h2 className="font-bold text-lg" style={{ color: "var(--t1)" }}>{monthLabel(monthId)}</h2>
        <button onClick={() => setMonthId(nextMonthId(monthId))} className="tap p-2.5 rounded-full"
          style={{ background: "var(--surface-2)" }}>
          <ChevronRight className="w-5 h-5" style={{ color: "var(--t2)" }} />
        </button>
      </div>

      {!budget ? (
        <div className="glass p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent-tint)" }}>
            <DollarSign className="w-8 h-8" style={{ color: "var(--accent)" }} />
          </div>
          <h3 className="font-semibold" style={{ color: "var(--t1)" }}>No budget for {monthLabel(monthId)}</h3>
          <p className="text-sm" style={{ color: "var(--t3)" }}>Set up your monthly budget to start tracking</p>
          <BtnPrimary onClick={() => setShowSetup(true)}>
            <Plus className="w-4 h-4" /> Create Budget
          </BtnPrimary>
        </div>
      ) : (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Wallet className="w-5 h-5" />} label="Total Budget"
              value={formatCurrency(budget.totalBudget, currency)} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Spent"
              value={formatCurrency(totalSpent, currency)} />
            <StatCard icon={<DollarSign className="w-5 h-5" />} label="Remaining"
              value={formatCurrency(remaining, currency)}
              valueColor={remaining < 0 ? "var(--bad)" : "var(--good)"} />
            <StatCard icon={<Activity className="w-5 h-5" />} label="Transactions"
              value={String(varExpenses.length + fixExpenses.length)} />
          </div>

          {/* Progress bar */}
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Budget Usage</span>
              <span className="text-sm font-bold"
                style={{ color: spentPct > 90 ? "var(--bad)" : spentPct > 70 ? "var(--warn)" : "var(--accent)" }}>
                {spentPct.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${spentPct}%`,
                  background: spentPct > 90 ? "var(--bad)" : spentPct > 70 ? "var(--warn)" : "var(--accent)",
                }} />
            </div>
          </div>

          {/* Money Places */}
          <div className="grid grid-cols-3 gap-3">
            <MoneyCard icon={<Landmark className="w-5 h-5" />} label="Bank"
              value={formatCurrency(budget.bankPart, currency)} tint="var(--accent-tint)" />
            <MoneyCard icon={<Home className="w-5 h-5" />} label="Home"
              value={formatCurrency(budget.homePart, currency)} tint="var(--warn-tint)" />
            <MoneyCard icon={<Wallet className="w-5 h-5" />} label="Wallet"
              value={formatCurrency(budget.walletPart, currency)} tint="var(--good-tint)" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4">
            <div className="glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Spending by Category</span>
              </div>
              <SpendingPieChart varExpenses={varExpenses} fixExpenses={fixExpenses} />
            </div>

            <div className="glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Budget Overview</span>
              </div>
              <BudgetBarChart totalBudget={budget.totalBudget} totalSpent={totalSpent} remaining={remaining} />
            </div>

            <div className="glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Daily Spending Trend</span>
              </div>
              <SpendingTrendChart expenses={varExpenses} />
            </div>
          </div>

          {/* Variable Expenses */}
          <div className="glass overflow-hidden">
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>Variable Expenses</h3>
                <p className="text-xs" style={{ color: "var(--t3)" }}>{formatCurrency(totalVarSpent, currency)} spent</p>
              </div>
              <button onClick={() => setShowAddVar(true)} className="px-3 py-1.5 text-xs font-medium tap flex items-center gap-1"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--r-pill)" }}>
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {varExpenses.length === 0 ? (
              <p className="p-4 text-sm text-center" style={{ color: "var(--t3)" }}>No variable expenses yet</p>
            ) : (
              <div className="p-3 space-y-2">
                {Object.entries(varByCategory).map(([cat, exps]) => (
                  <div key={cat}>
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: (CAT_COLOR[cat] || "#8A8175") + "20", color: CAT_COLOR[cat] || "#8A8175" }}>
                        {CAT_ICONS[cat] || <CircleDot className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--t1)" }}>{cat}</span>
                      <span className="ml-auto text-xs font-medium" style={{ color: CAT_COLOR[cat] || "var(--t2)" }}>
                        {formatCurrency(exps.reduce((s, e) => s + e.amount, 0), currency)}
                      </span>
                    </div>
                    {exps.map(e => (
                      <div key={e.id} className="flex items-center justify-between pl-10 pr-2 py-1.5 group">
                        <div>
                          <p className="text-xs" style={{ color: "var(--t2)" }}>{e.name}</p>
                          <p className="text-[10px]" style={{ color: "var(--t3)" }}>{e.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium" style={{ color: "var(--t1)" }}>
                            {formatCurrency(e.amount, currency)}
                          </span>
                          <button onClick={() => handleDeleteVar(e.id)} className="tap opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--bad)" }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed Expenses */}
          <div className="glass overflow-hidden">
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>Fixed Expenses</h3>
                <p className="text-xs" style={{ color: "var(--t3)" }}>{formatCurrency(totalFixSpent, currency)} spent</p>
              </div>
              <button onClick={() => setShowAddFix(true)} className="px-3 py-1.5 text-xs font-medium tap flex items-center gap-1"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--r-pill)" }}>
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {fixExpenses.length === 0 ? (
              <p className="p-4 text-sm text-center" style={{ color: "var(--t3)" }}>No fixed expenses yet</p>
            ) : (
              <div className="p-3 space-y-2">
                {fixExpenses.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-2 group"
                    style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: (CAT_COLOR[e.type] || "#8A8175") + "20", color: CAT_COLOR[e.type] || "#8A8175" }}>
                        {CAT_ICONS[e.type] || <CircleDot className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--t1)" }}>{e.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--t3)" }}>{e.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-medium" style={{ color: "var(--t1)" }}>
                          {formatCurrency(e.amount, currency)}
                        </p>
                        {e.base > 0 && (
                          <p className="text-[10px]" style={{ color: "var(--t3)" }}>
                            Budget: {formatCurrency(e.base, currency)}
                          </p>
                        )}
                      </div>
                      <button onClick={() => handleDeleteFix(e.id)} className="tap opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--bad)" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {showSetup && (
        <Modal title={`Set Budget — ${monthLabel(monthId)}`} onClose={() => setShowSetup(false)}>
          <Field label="Total Budget" value={setupTotal} onChange={setSetupTotal} type="number" placeholder="3000" />
          <Field label="Home Cash" value={setupHome} onChange={setSetupHome} type="number" placeholder="500" />
          <Field label="Wallet Cash" value={setupWallet} onChange={setSetupWallet} type="number" placeholder="200" />
          <Field label="Bank" value={setupBank} onChange={setSetupBank} type="number" placeholder="2300" />
          <BtnPrimary onClick={handleCreateBudget}>Create Budget</BtnPrimary>
        </Modal>
      )}

      {showAddVar && (
        <Modal title="Add Variable Expense" onClose={() => setShowAddVar(false)}>
          <Field label="Name" value={expName} onChange={setExpName} placeholder="Coffee" />
          <Field label="Amount" value={expAmount} onChange={setExpAmount} type="number" placeholder="4.50" />
          <SelectField label="Category" value={expType} onChange={setExpType}
            options={VARIABLE_TYPES.map(t => ({ value: t, label: t }))} />
          <Field label="Date" value={expDate} onChange={setExpDate} type="date" />
          <BtnPrimary onClick={handleAddVar}>Add Expense</BtnPrimary>
        </Modal>
      )}

      {showAddFix && (
        <Modal title="Add Fixed Expense" onClose={() => setShowAddFix(false)}>
          <Field label="Name" value={fixName} onChange={setFixName} placeholder="Rent" />
          <Field label="Amount" value={fixAmount} onChange={setFixAmount} type="number" placeholder="1200" />
          <SelectField label="Type" value={fixType} onChange={setFixType}
            options={FIXED_TYPES.map(t => ({ value: t, label: t }))} />
          <Field label="Budget (optional)" value={fixBase} onChange={setFixBase} type="number" placeholder="1200" />
          <BtnPrimary onClick={handleAddFix}>Add Expense</BtnPrimary>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, valueColor }: {
  icon: React.ReactNode; label: string; value: string; valueColor?: string;
}) {
  return (
    <div className="glass p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <span className="text-xs" style={{ color: "var(--t3)" }}>{label}</span>
      </div>
      <p className="text-lg font-bold" style={{ color: valueColor || "var(--t1)" }}>{value}</p>
    </div>
  );
}

function MoneyCard({ icon, label, value, tint }: {
  icon: React.ReactNode; label: string; value: string; tint: string;
}) {
  return (
    <div className="glass p-3 text-center">
      <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2" style={{ background: tint }}>
        {icon}
      </div>
      <p className="text-[11px]" style={{ color: "var(--t3)" }}>{label}</p>
      <p className="text-sm font-bold mt-0.5" style={{ color: "var(--t1)" }}>{value}</p>
    </div>
  );
}
