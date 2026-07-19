"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Target, Trash2, Edit2, Check, TrendingUp, PiggyBank } from "lucide-react";
import Modal, { Field, BtnPrimary } from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import {
  getSavingGoals, addSavingGoal, updateSavingGoal, deleteSavingGoal,
  type SavingGoal,
} from "@/lib/firestore";
import { formatCurrency } from "@/lib/constants";

export default function SavingsPage() {
  const { user, profile } = useAuth();
  const currency = profile?.currency || "USD";
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [showContribute, setShowContribute] = useState<SavingGoal | null>(null);

  // Form states
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [contributeAmount, setContributeAmount] = useState("");

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getSavingGoals(user.uid);
      setGoals(data);
    } catch (e) {
      console.error("Error fetching goals:", e);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleAdd = async () => {
    if (!user || !goalName || !goalTarget) return;
    await addSavingGoal({
      userId: user.uid,
      name: goalName,
      target: parseFloat(goalTarget) || 0,
      current: parseFloat(goalCurrent) || 0,
      active: true,
      createdAt: new Date().toISOString(),
    });
    setShowAdd(false);
    setGoalName(""); setGoalTarget(""); setGoalCurrent("");
    fetchGoals();
  };

  const handleUpdate = async () => {
    if (!editingGoal) return;
    await updateSavingGoal(editingGoal.id, {
      name: goalName,
      target: parseFloat(goalTarget) || 0,
      current: parseFloat(goalCurrent) || 0,
    });
    setEditingGoal(null);
    setGoalName(""); setGoalTarget(""); setGoalCurrent("");
    fetchGoals();
  };

  const handleContribute = async () => {
    if (!showContribute) return;
    const newAmount = showContribute.current + (parseFloat(contributeAmount) || 0);
    await updateSavingGoal(showContribute.id, { current: newAmount });
    setShowContribute(null);
    setContributeAmount("");
    fetchGoals();
  };

  const handleDelete = async (id: string) => {
    await deleteSavingGoal(id);
    fetchGoals();
  };

  const openEdit = (goal: SavingGoal) => {
    setGoalName(goal.name);
    setGoalTarget(String(goal.target));
    setGoalCurrent(String(goal.current));
    setEditingGoal(goal);
  };

  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const activeGoals = goals.filter(g => g.active);
  const completedGoals = goals.filter(g => g.current >= g.target);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--good)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 space-y-2">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5" style={{ color: "var(--good)" }} />
            <span className="text-xs" style={{ color: "var(--t3)" }}>Total Saved</span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--good)" }}>
            {formatCurrency(totalSaved, currency)}
          </p>
        </div>
        <div className="glass p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ color: "var(--t3)" }}>Total Target</span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--t1)" }}>
            {formatCurrency(totalTarget, currency)}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      {totalTarget > 0 && (
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Overall Progress</span>
            <span className="text-sm font-bold" style={{ color: "var(--good)" }}>
              {((totalSaved / totalTarget) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%`, background: "var(--good)" }} />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--t3)" }}>
            <span>{activeGoals.length} active goals</span>
            <span>{completedGoals.length} completed</span>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      <button onClick={() => setShowAdd(true)}
        className="w-full glass p-4 flex items-center justify-center gap-2 tap"
        style={{ border: "2px dashed var(--good)" }}>
        <Plus className="w-5 h-5" style={{ color: "var(--good)" }} />
        <span className="font-medium" style={{ color: "var(--good)" }}>Add Saving Goal</span>
      </button>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="glass p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "var(--good-tint)" }}>
            <PiggyBank className="w-8 h-8" style={{ color: "var(--good)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--t1)" }}>No saving goals yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--t3)" }}>Start saving for something special!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            return (
              <div key={goal.id} className="glass p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: isComplete ? "var(--good-tint)" : "var(--accent-tint)" }}>
                      {isComplete ? (
                        <Check className="w-5 h-5" style={{ color: "var(--good)" }} />
                      ) : (
                        <Target className="w-5 h-5" style={{ color: "var(--accent)" }} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>{goal.name}</h4>
                      <p className="text-xs" style={{ color: "var(--t3)" }}>
                        {formatCurrency(goal.current, currency)} / {formatCurrency(goal.target, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(goal)} className="tap p-1.5"
                      style={{ color: "var(--t3)" }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="tap p-1.5"
                      style={{ color: "var(--bad)" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      background: isComplete ? "var(--good)" : "var(--accent)",
                    }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium"
                    style={{ color: isComplete ? "var(--good)" : "var(--accent-dim)" }}>
                    {progress.toFixed(0)}% complete
                  </span>
                  {!isComplete && (
                    <button onClick={() => { setShowContribute(goal); setContributeAmount(""); }}
                      className="px-3 py-1.5 text-xs font-medium tap flex items-center gap-1"
                      style={{ background: "var(--good)", color: "#fff", borderRadius: "var(--r-pill)" }}>
                      <TrendingUp className="w-3 h-3" /> Contribute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="New Saving Goal" onClose={() => setShowAdd(false)}>
          <Field label="Goal Name" value={goalName} onChange={setGoalName} placeholder="Vacation fund" />
          <Field label="Target Amount" value={goalTarget} onChange={setGoalTarget} type="number" placeholder="5000" />
          <Field label="Current Amount (optional)" value={goalCurrent} onChange={setGoalCurrent} type="number" placeholder="0" />
          <BtnPrimary onClick={handleAdd}>
            <Target className="w-4 h-4" /> Create Goal
          </BtnPrimary>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingGoal && (
        <Modal title="Edit Goal" onClose={() => { setEditingGoal(null); setGoalName(""); setGoalTarget(""); setGoalCurrent(""); }}>
          <Field label="Goal Name" value={goalName} onChange={setGoalName} />
          <Field label="Target Amount" value={goalTarget} onChange={setGoalTarget} type="number" />
          <Field label="Current Amount" value={goalCurrent} onChange={setGoalCurrent} type="number" />
          <BtnPrimary onClick={handleUpdate}>
            <Check className="w-4 h-4" /> Save Changes
          </BtnPrimary>
        </Modal>
      )}

      {/* Contribute Modal */}
      {showContribute && (
        <Modal title={`Contribute to ${showContribute.name}`} onClose={() => setShowContribute(null)}>
          <div className="text-center mb-4">
            <p className="text-sm" style={{ color: "var(--t3)" }}>Current: {formatCurrency(showContribute.current, currency)}</p>
            <p className="text-sm" style={{ color: "var(--t3)" }}>
              Remaining: {formatCurrency(showContribute.target - showContribute.current, currency)}
            </p>
          </div>
          <Field label="Amount to Add" value={contributeAmount} onChange={setContributeAmount} type="number" placeholder="100" />
          <BtnPrimary onClick={handleContribute}>
            <TrendingUp className="w-4 h-4" /> Add Contribution
          </BtnPrimary>
        </Modal>
      )}
    </div>
  );
}
