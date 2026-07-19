"use client";

import { useState } from "react";
import Modal, { Field, SelectField, BtnPrimary } from "./Modal";
import { CURRENCIES } from "@/lib/constants";
import {
  User, Coins, Bell, Shield, Check, Settings, Globe,
  AlertTriangle, Trash2
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  displayName: string;
  currency: string;
  notifications: boolean;
  plan: string;
  createdAt: string;
}

interface SettingsModalProps {
  user: UserData;
  onClose: () => void;
  onSaved: () => void;
  onLogout: () => void;
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={{
      background: "var(--surface)", borderRadius: "var(--r-card)",
      boxShadow: "var(--shadow-card)", border: "1px solid var(--border)"
    }}>
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <span style={{ color: "var(--accent-dim)" }}>{icon}</span>
        <h3 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>{title}</h3>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

export default function SettingsModal({ user, onClose, onSaved, onLogout }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [currency, setCurrency] = useState(user.currency);
  const [notifications, setNotifications] = useState(user.notifications);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, currency, notifications }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onSaved(); }, 1500);
  };

  return (
    <Modal title="Settings" onClose={onClose} wide>
      <div className="space-y-4">
        {/* Profile */}
        <Card icon={<User className="w-5 h-5" />} title="Profile">
          <div className="space-y-3">
            <Field label="Display Name" value={displayName} onChange={setDisplayName} />
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--t2)" }}>Email</label>
              <input value={user.email} disabled className="field cursor-not-allowed opacity-60" />
              <p className="text-[11px] mt-1" style={{ color: "var(--t3)" }}>Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--t2)" }}>Plan</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-medium"
                  style={{
                    background: user.plan === "pro" ? "var(--accent-tint)" : "var(--surface-3)",
                    color: user.plan === "pro" ? "var(--accent-dim)" : "var(--t2)",
                    borderRadius: "var(--r-pill)",
                  }}>
                  {user.plan === "pro" ? "Pro" : "Free"}
                </span>
                {user.plan !== "pro" && (
                  <span className="text-[11px]" style={{ color: "var(--t3)" }}>Upgrade coming soon</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Currency */}
        <Card icon={<Coins className="w-5 h-5" />} title="Currency">
          <SelectField label="Default Currency" value={currency} onChange={setCurrency}
            options={CURRENCIES.map(c => ({ value: c.code, label: `${c.symbol} — ${c.name} (${c.code})` }))} />
        </Card>

        {/* Notifications */}
        <Card icon={<Bell className="w-5 h-5" />} title="Notifications">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--t2)" }}>Budget Alerts</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--t3)" }}>
                Get notified when you&apos;re close to your budget limit
              </p>
            </div>
            <button onClick={() => setNotifications(!notifications)}
              className="relative w-12 h-7 transition-colors"
              style={{ background: notifications ? "var(--accent)" : "var(--border-2)", borderRadius: "var(--r-pill)" }}>
              <div className="absolute top-0.5 w-6 h-6 rounded-full shadow-sm transition-all duration-200"
                style={{ background: "var(--bg)", left: notifications ? "22px" : "2px" }} />
            </button>
          </div>
        </Card>

        {/* Account Info */}
        <Card icon={<Globe className="w-5 h-5" />} title="Account Info">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--t3)" }}>Account ID</span>
              <span className="font-mono text-xs" style={{ color: "var(--t2)" }}>
                {user.id.slice(0, 8)}…
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--t3)" }}>Member since</span>
              <span style={{ color: "var(--t2)" }}>
                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </Card>

        {/* Save */}
        <BtnPrimary onClick={handleSave} disabled={saving}>
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--accent-ink)", borderTopColor: "transparent" }} />
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Settings className="w-4 h-4" /> Save Changes</>
          )}
        </BtnPrimary>

        {/* Danger Zone */}
        <div className="overflow-hidden" style={{
          background: "var(--surface)", borderRadius: "var(--r-card)",
          border: "1px solid var(--bad)", boxShadow: "var(--shadow-card)"
        }}>
          <div className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid var(--bad-tint)" }}>
            <Shield className="w-5 h-5" style={{ color: "var(--bad)" }} />
            <h3 className="font-semibold text-sm" style={{ color: "var(--bad)" }}>Danger Zone</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--t2)" }}>Log Out</p>
                <p className="text-[11px]" style={{ color: "var(--t3)" }}>Sign out of your account</p>
              </div>
              <button onClick={onLogout}
                className="px-4 py-2 text-sm font-medium transition hover:opacity-80 tap"
                style={{ border: "1px solid var(--border-2)", color: "var(--t2)", borderRadius: "var(--r-field)" }}>
                Log Out
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--t2)" }}>Delete Account</p>
                <p className="text-[11px]" style={{ color: "var(--t3)" }}>Permanently delete all data</p>
              </div>
              <button onClick={() => setShowDelete(true)}
                className="px-4 py-2 text-sm font-medium transition hover:opacity-80 tap"
                style={{ border: "1px solid var(--bad)", color: "var(--bad)", borderRadius: "var(--r-field)" }}>
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDelete && (
          <div className="p-4 space-y-3" style={{
            background: "var(--bad-tint)", borderRadius: "var(--r-field)",
            border: "1px solid var(--bad)"
          }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: "var(--bad)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--bad)" }}>
                Type DELETE to confirm
              </p>
            </div>
            <Field label="" value={deleteConfirm} onChange={setDeleteConfirm} placeholder="Type DELETE" />
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 py-2 text-sm font-medium tap"
                style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)", color: "var(--t2)" }}>
                Cancel
              </button>
              <button onClick={() => { /* Not implemented */ }}
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 py-2 text-sm font-medium tap disabled:opacity-30"
                style={{ background: "var(--bad)", color: "#fff", borderRadius: "var(--r-field)" }}>
                Delete Forever
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
