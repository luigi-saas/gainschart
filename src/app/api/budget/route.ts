import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { monthBudgets, variableExpenses, fixedExpenses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const monthId = req.nextUrl.searchParams.get("monthId");
  if (!monthId) return NextResponse.json({ error: "monthId required" }, { status: 400 });

  const [budget] = await db.select().from(monthBudgets)
    .where(and(eq(monthBudgets.userId, userId), eq(monthBudgets.monthId, monthId))).limit(1);
  if (!budget) return NextResponse.json({ budget: null });

  const varExps = await db.select().from(variableExpenses)
    .where(eq(variableExpenses.monthBudgetId, budget.id));
  const fixExps = await db.select().from(fixedExpenses)
    .where(eq(fixedExpenses.monthBudgetId, budget.id));

  return NextResponse.json({
    budget: { ...budget, variableExpenses: varExps, fixedExpenses: fixExps },
  });
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [budget] = await db.insert(monthBudgets).values({
    userId,
    monthId: body.monthId,
    totalBudget: body.totalBudget,
    homePart: body.homePart || 0,
    walletPart: body.walletPart || 0,
    bankPart: body.bankPart || 0,
  }).returning();
  return NextResponse.json({ budget });
}
