"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Target, Trash2, Edit2, Check, TrendingUp, PiggyBank } from "lucide-react";
import Modal, { Field, BtnPrimary } from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import { getSavingGoals, addSavingGoal, updateSavingGoal, deleteSavingGoal, type SavingGoal } from "@/lib/firestore";
import { formatCurrency } from "@/lib/constants";

export default function SavingsPage() {
  const { user, profile } = useAuth();
  const currency = profile?.currency || "USD";
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<SavingGoal | null>(null);
  const [contributing, setContributing] = useState<SavingGoal | null>(null);
  const [gName, setGName] = useState(""); const [gTarget, setGTarget] = useState(""); const [gCurrent, setGCurrent] = useState(""); const [contrib, setContrib] = useState("");

  const fetch_ = useCallback(async () => { if (!user) return; setLoading(true); try { setGoals(await getSavingGoals(user.uid)); } catch(e){ console.error(e); } setLoading(false); }, [user]);
  useEffect(() => { fetch_(); }, [fetch_]);

  const doAdd = async () => { if (!user||!gName||!gTarget) return; await addSavingGoal({ userId:user.uid, name:gName, target:parseFloat(gTarget)||0, current:parseFloat(gCurrent)||0, active:true, createdAt:"" }); setShowAdd(false); setGName(""); setGTarget(""); setGCurrent(""); fetch_(); };
  const doUpdate = async () => { if (!editing) return; await updateSavingGoal(editing.id, { name:gName, target:parseFloat(gTarget)||0, current:parseFloat(gCurrent)||0 }); setEditing(null); setGName(""); setGTarget(""); setGCurrent(""); fetch_(); };
  const doContrib = async () => { if (!contributing) return; await updateSavingGoal(contributing.id, { current: contributing.current + (parseFloat(contrib)||0) }); setContributing(null); setContrib(""); fetch_(); };
  const openEdit = (g: SavingGoal) => { setGName(g.name); setGTarget(String(g.target)); setGCurrent(String(g.current)); setEditing(g); };

  const totalSaved = goals.reduce((s,g) => s+g.current, 0);
  const totalTarget = goals.reduce((s,g) => s+g.target, 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-3 animate-spin" style={{ borderColor:"var(--good)", borderTopColor:"transparent" }}/></div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 space-y-2"><div className="flex items-center gap-2"><PiggyBank className="w-5 h-5" style={{ color:"var(--good)" }}/><span className="text-xs" style={{ color:"var(--t3)" }}>Total Saved</span></div><p className="text-xl font-bold" style={{ color:"var(--good)" }}>{formatCurrency(totalSaved,currency)}</p></div>
        <div className="glass p-4 space-y-2"><div className="flex items-center gap-2"><Target className="w-5 h-5" style={{ color:"var(--accent)" }}/><span className="text-xs" style={{ color:"var(--t3)" }}>Total Target</span></div><p className="text-xl font-bold" style={{ color:"var(--t1)" }}>{formatCurrency(totalTarget,currency)}</p></div>
      </div>

      {totalTarget>0 && (<div className="glass p-4">
        <div className="flex justify-between mb-2"><span className="text-sm font-medium" style={{ color:"var(--t1)" }}>Overall</span><span className="text-sm font-bold" style={{ color:"var(--good)" }}>{((totalSaved/totalTarget)*100).toFixed(0)}%</span></div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background:"var(--surface-2)" }}><div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.min((totalSaved/totalTarget)*100,100)}%`, background:"var(--good)" }}/></div>
      </div>)}

      <button onClick={()=>setShowAdd(true)} className="w-full glass p-4 flex items-center justify-center gap-2 tap" style={{ border:"2px dashed var(--good)" }}><Plus className="w-5 h-5" style={{ color:"var(--good)" }}/><span className="font-medium" style={{ color:"var(--good)" }}>Add Saving Goal</span></button>

      {goals.length===0 ? (<div className="glass p-8 text-center"><div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background:"var(--good-tint)" }}><PiggyBank className="w-8 h-8" style={{ color:"var(--good)" }}/></div><p className="text-sm font-medium" style={{ color:"var(--t1)" }}>No saving goals yet</p></div>)
      : (<div className="space-y-3">{goals.map(g => {
        const pct = (g.current/g.target)*100; const done = g.current>=g.target;
        return (<div key={g.id} className="glass p-4">
          <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:done?"var(--good-tint)":"var(--accent-tint)" }}>{done?<Check className="w-5 h-5" style={{ color:"var(--good)" }}/>:<Target className="w-5 h-5" style={{ color:"var(--accent)" }}/>}</div><div><h4 className="font-semibold text-sm" style={{ color:"var(--t1)" }}>{g.name}</h4><p className="text-xs" style={{ color:"var(--t3)" }}>{formatCurrency(g.current,currency)} / {formatCurrency(g.target,currency)}</p></div></div>
            <div className="flex items-center gap-1"><button onClick={()=>openEdit(g)} className="tap p-1.5" style={{ color:"var(--t3)" }}><Edit2 className="w-4 h-4"/></button><button onClick={()=>{deleteSavingGoal(g.id);fetch_();}} className="tap p-1.5" style={{ color:"var(--bad)" }}><Trash2 className="w-4 h-4"/></button></div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background:"var(--surface-2)" }}><div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.min(pct,100)}%`, background:done?"var(--good)":"var(--accent)" }}/></div>
          <div className="flex items-center justify-between"><span className="text-xs font-medium" style={{ color:done?"var(--good)":"var(--accent-dim)" }}>{pct.toFixed(0)}%</span>{!done && <button onClick={()=>{setContributing(g);setContrib("");}} className="px-3 py-1.5 text-xs font-medium tap flex items-center gap-1" style={{ background:"var(--good)",color:"#fff",borderRadius:"var(--r-pill)" }}><TrendingUp className="w-3 h-3"/> Contribute</button>}</div>
        </div>);
      })}</div>)}

      {showAdd && (<Modal title="New Saving Goal" onClose={()=>setShowAdd(false)}>
        <Field label="Name" value={gName} onChange={setGName} placeholder="Vacation"/><Field label="Target" value={gTarget} onChange={setGTarget} type="number" placeholder="5000"/><Field label="Current (optional)" value={gCurrent} onChange={setGCurrent} type="number" placeholder="0"/>
        <BtnPrimary onClick={doAdd}><Target className="w-4 h-4"/> Create Goal</BtnPrimary>
      </Modal>)}
      {editing && (<Modal title="Edit Goal" onClose={()=>{setEditing(null);setGName("");setGTarget("");setGCurrent("");}}>
        <Field label="Name" value={gName} onChange={setGName}/><Field label="Target" value={gTarget} onChange={setGTarget} type="number"/><Field label="Current" value={gCurrent} onChange={setGCurrent} type="number"/>
        <BtnPrimary onClick={doUpdate}><Check className="w-4 h-4"/> Save</BtnPrimary>
      </Modal>)}
      {contributing && (<Modal title={`Contribute to ${contributing.name}`} onClose={()=>setContributing(null)}>
        <div className="text-center mb-4"><p className="text-sm" style={{ color:"var(--t3)" }}>Current: {formatCurrency(contributing.current,currency)}</p><p className="text-sm" style={{ color:"var(--t3)" }}>Remaining: {formatCurrency(contributing.target-contributing.current,currency)}</p></div>
        <Field label="Amount" value={contrib} onChange={setContrib} type="number" placeholder="100"/>
        <BtnPrimary onClick={doContrib}><TrendingUp className="w-4 h-4"/> Add</BtnPrimary>
      </Modal>)}
    </div>
  );
}
