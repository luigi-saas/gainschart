"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] flex flex-col animate-slideUp
          rounded-t-[24px] sm:rounded-[20px]`}
        style={{
          background: "var(--surface)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between p-5 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--t1)" }}>{title}</h2>
          <button onClick={onClose} className="tap w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "var(--surface-2)" }}>
            <X className="w-4 h-4" style={{ color: "var(--t2)" }} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Shared Field Components ─────────────────────────────────────────────────
export function Field({
  label, value, onChange, type, placeholder
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--t2)" }}>{label}</label>
      <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)}
        className="field" placeholder={placeholder} />
    </div>
  );
}

export function SelectField({
  label, value, onChange, options
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--t2)" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="field appearance-none">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function BtnPrimary({
  onClick, children, disabled, variant
}: {
  onClick: () => void; children: ReactNode;
  disabled?: boolean; variant?: "accent" | "sport" | "bad";
}) {
  const bg = variant === "sport" ? "var(--sport)" : variant === "bad" ? "var(--bad)" : "var(--accent)";
  const ink = variant === "sport" || variant === "bad" ? "#fff" : "var(--accent-ink)";
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm transition
        hover:opacity-90 disabled:opacity-50 tap"
      style={{
        background: bg, color: ink,
        borderRadius: "var(--r-field)", boxShadow: "var(--shadow-btn)",
      }}>
      {children}
    </button>
  );
}
