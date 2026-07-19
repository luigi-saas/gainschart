import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { variableExpenses, fixedExpenses } from "@/db/schema";
import { getSessionUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  if (body.kind === "variable") {
    const [exp] = await db.insert(variableExpenses).values({
      userId,
      monthBudgetId: body.monthBudgetId,
      name: body.name,
      amount: body.amount,
      type: body.type,
      date: body.date,
    }).returning();
    return NextResponse.json({ expense: exp });
  } else {
    const [exp] = await db.insert(fixedExpenses).values({
      userId,
      monthBudgetId: body.monthBudgetId,
      name: body.name,
      amount: body.amount,
      type: body.type,
      base: body.base || 0,
    }).returning();
    return NextResponse.json({ expense: exp });
  }
}
