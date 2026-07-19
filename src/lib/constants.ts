// ── Category types ──────────────────────────────────────────────────────────
export const VARIABLE_TYPES = [
  "Groceries", "Transport", "Restaurants", "Entertainment",
  "Beauty", "Family", "Shopping", "Health", "Education", "Other",
] as const;

export const FIXED_TYPES = [
  "Rent", "Utilities", "Internet", "Phone",
  "Insurance", "Subscriptions", "Other",
] as const;

// ── Category Colors ─────────────────────────────────────────────────────────
export const CAT_COLOR: Record<string, string> = {
  Groceries: "#D6A75C", Transport: "#7B9E8E", Restaurants: "#C9695A",
  Entertainment: "#B9925A", Beauty: "#C98A8F", Family: "#8FA37E",
  Shopping: "#C9695A", Health: "#5FA97A", Education: "#7B9E8E",
  Other: "#8A8175", Rent: "#D6A75C", Utilities: "#7B9E8E",
  Internet: "#5FA97A", Phone: "#B9925A", Insurance: "#C98A8F",
  Subscriptions: "#8A8175",
};

// ── Currencies ──────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "MAD", symbol: "MAD", name: "Moroccan Dirham" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
];

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const c = CURRENCIES.find(x => x.code === currency);
  const sym = c?.symbol ?? currency;
  return `${sym}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Month helpers ───────────────────────────────────────────────────────────
export function currentMonthId(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(id: string): string {
  const [y, m] = id.split("-");
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("en-US", {
    month: "long", year: "numeric",
  });
}

export function prevMonthId(id: string): string {
  const [y, m] = id.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function nextMonthId(id: string): string {
  const [y, m] = id.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ── Body Parts for Exercise DB ──────────────────────────────────────────────
export const BODY_PARTS = [
  "back", "cardio", "chest", "lower arms", "lower legs",
  "neck", "shoulders", "upper arms", "upper legs", "waist",
] as const;

export const BODY_PART_EMOJI: Record<string, string> = {
  back: "🔙", cardio: "❤️", chest: "💪", "lower arms": "💪",
  "lower legs": "🦵", neck: "🔝", shoulders: "🏋️", "upper arms": "💪",
  "upper legs": "🦵", waist: "🎯",
};

export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
