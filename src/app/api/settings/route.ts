import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.update(users).set({
    displayName: body.displayName,
    currency: body.currency,
    notifications: body.notifications,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
  return NextResponse.json({ ok: true });
}
