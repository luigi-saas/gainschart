"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Coins, Bell, Shield, LogOut, Check, Settings, Globe, AlertTriangle, Trash2, Crown, ChevronRight } from "lucide-react";
import Modal, { Field, SelectField, BtnPrimary } from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import { CURRENCIES } from "@/lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, logout, updateUserProfile, resetPassword } = useAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [currency, setCurrency] = useState(profile?.currency || "USD");
  const [notifications, setNotifications] = useState(profile?.notifications ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({ displayName, currency, notifications });
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setShowSettings(false); }, 1500);
  };

  const handleLogout = async () => { await logout(); router.replace("/login"); };
  const handleReset = async () => { if (user?.email) { try { await resetPassword(user.email); alert("Reset email sent!"); } catch(e){ console.error(e); } } };

  if (!profile) return null;

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="glass p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background:"var(--accent-tint)" }}>
          {profile.photoURL
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={profile.photoURL} alt="" className="w-20 h-20 rounded-full object-cover"/>
            : <User className="w-10 h-10" style={{ color:"var(--accent)" }}/>}
        </div>
        <h2 className="text-xl font-bold" style={{ color:"var(--t1)" }}>{profile.displayName}</h2>
        <p className="text-sm mt-1" style={{ color:"var(--t3)" }}>{profile.email}</p>
        <div className="flex justify-center mt-3"><span className="px-3 py-1 text-xs font-semibold" style={{ background:profile.plan==="pro"?"var(--accent-tint)":"var(--surface-2)", color:profile.plan==="pro"?"var(--accent-dim)":"var(--t2)", borderRadius:"var(--r-pill)" }}>{profile.plan==="pro"?<><Crown className="w-3 h-3 inline mr-1"/>Pro</>:"Free Plan"}</span></div>
      </div>

      {/* Menu items */}
      <div className="space-y-2">
        <Item icon={<Settings className="w-5 h-5"/>} label="Settings" sub="Customize your experience" onClick={()=>{setDisplayName(profile.displayName);setCurrency(profile.currency);setNotifications(profile.notifications);setShowSettings(true);}}/>
        <Item icon={<Bell className="w-5 h-5"/>} label="Notifications" sub={notifications?"Enabled":"Disabled"} onClick={()=>{setDisplayName(profile.displayName);setCurrency(profile.currency);setNotifications(profile.notifications);setShowSettings(true);}}
          trailing={<div className="w-10 h-6 rounded-full" style={{ background:notifications?"var(--good)":"var(--border-2)" }}><div className="w-5 h-5 rounded-full mt-0.5 transition-all" style={{ background:"#fff", marginLeft:notifications?"18px":"2px" }}/></div>}/>
        <Item icon={<Shield className="w-5 h-5"/>} label="Reset Password" sub="Send reset email" onClick={handleReset}/>
        <Item icon={<Globe className="w-5 h-5"/>} label="Currency" sub={currency} onClick={()=>{setDisplayName(profile.displayName);setCurrency(profile.currency);setNotifications(profile.notifications);setShowSettings(true);}}/>
      </div>

      {/* Account info */}
      <div className="glass p-4 space-y-3">
        <h3 className="font-semibold text-sm" style={{ color:"var(--t1)" }}>Account</h3>
        <div className="flex justify-between text-sm"><span style={{ color:"var(--t3)" }}>Member since</span><span style={{ color:"var(--t2)" }}>{new Date(profile.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"})}</span></div>
        <div className="flex justify-between text-sm"><span style={{ color:"var(--t3)" }}>UID</span><span className="font-mono text-xs" style={{ color:"var(--t2)" }}>{profile.uid.slice(0,8)}…</span></div>
      </div>

      {/* Danger */}
      <div className="space-y-2">
        <button onClick={handleLogout} className="w-full glass p-4 flex items-center gap-3 tap"><LogOut className="w-5 h-5" style={{ color:"var(--warn)" }}/><span className="font-medium text-sm" style={{ color:"var(--warn)" }}>Log Out</span></button>
        <button onClick={()=>setShowDanger(true)} className="w-full p-4 flex items-center gap-3 tap" style={{ background:"var(--bad-tint)", borderRadius:"var(--r-card)", border:"1px solid var(--bad)" }}><Trash2 className="w-5 h-5" style={{ color:"var(--bad)" }}/><span className="font-medium text-sm" style={{ color:"var(--bad)" }}>Delete Account</span></button>
      </div>

      {/* Settings modal */}
      {showSettings && (<Modal title="Settings" onClose={()=>setShowSettings(false)} wide>
        <div className="space-y-4">
          <Section icon={<User className="w-4 h-4"/>} title="Profile"><Field label="Display Name" value={displayName} onChange={setDisplayName}/><div className="mt-3"><label className="block text-xs font-medium mb-1.5" style={{ color:"var(--t2)" }}>Email</label><input value={profile.email} disabled className="field cursor-not-allowed opacity-60"/></div></Section>
          <Section icon={<Coins className="w-4 h-4"/>} title="Currency"><SelectField label="Default Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map(c=>({value:c.code,label:`${c.symbol} — ${c.name}`}))}/></Section>
          <Section icon={<Bell className="w-4 h-4"/>} title="Notifications"><div className="flex items-center justify-between"><div><p className="text-sm" style={{ color:"var(--t2)" }}>Budget Alerts</p><p className="text-[11px]" style={{ color:"var(--t3)" }}>Near-limit warnings</p></div><button onClick={()=>setNotifications(!notifications)} className="relative w-12 h-7 transition-colors" style={{ background:notifications?"var(--good)":"var(--border-2)", borderRadius:"var(--r-pill)" }}><div className="absolute top-0.5 w-6 h-6 rounded-full shadow-sm transition-all duration-200" style={{ background:"#fff", left:notifications?"22px":"2px" }}/></button></div></Section>
          <BtnPrimary onClick={handleSave} disabled={saving}>
            {saving ? <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor:"var(--accent-ink)", borderTopColor:"transparent" }}/> : saved ? <><Check className="w-4 h-4"/> Saved!</> : <><Settings className="w-4 h-4"/> Save Changes</>}
          </BtnPrimary>
        </div>
      </Modal>)}

      {showDanger && (<Modal title="Delete Account" onClose={()=>setShowDanger(false)}>
        <div className="text-center py-4"><div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background:"var(--bad-tint)" }}><AlertTriangle className="w-8 h-8" style={{ color:"var(--bad)" }}/></div><h3 className="font-bold text-lg" style={{ color:"var(--t1)" }}>Are you sure?</h3><p className="text-sm mt-2" style={{ color:"var(--t3)" }}>This cannot be undone.</p></div>
        <div className="flex gap-3"><button onClick={()=>setShowDanger(false)} className="flex-1 py-3 font-medium text-sm tap" style={{ background:"var(--surface-2)", borderRadius:"var(--r-field)", color:"var(--t2)" }}>Cancel</button><button className="flex-1 py-3 font-medium text-sm tap" style={{ background:"var(--bad)", borderRadius:"var(--r-field)", color:"#fff" }}>Delete Forever</button></div>
      </Modal>)}
    </div>
  );
}

function Item({ icon, label, sub, onClick, trailing }:{ icon:React.ReactNode; label:string; sub?:string; onClick?:()=>void; trailing?:React.ReactNode }) {
  return (<button onClick={onClick} className="w-full glass p-4 flex items-center gap-3 tap"><span style={{ color:"var(--accent)" }}>{icon}</span><div className="flex-1 text-left"><p className="font-medium text-sm" style={{ color:"var(--t1)" }}>{label}</p>{sub && <p className="text-[11px]" style={{ color:"var(--t3)" }}>{sub}</p>}</div>{trailing||<ChevronRight className="w-4 h-4" style={{ color:"var(--t3)" }}/>}</button>);
}
function Section({ icon, title, children }:{ icon:React.ReactNode; title:string; children:React.ReactNode }) {
  return (<div className="p-4" style={{ background:"var(--surface-2)", borderRadius:"var(--r-field)" }}><div className="flex items-center gap-2 mb-3"><span style={{ color:"var(--accent)" }}>{icon}</span><span className="font-medium text-sm" style={{ color:"var(--t1)" }}>{title}</span></div>{children}</div>);
}
