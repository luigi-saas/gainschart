import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sportProgrammes, programmeExercises } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(sportProgrammes)
    .where(and(eq(sportProgrammes.id, id), eq(sportProgrammes.userId, userId)));
  return NextResponse.json({ ok: true });
}
