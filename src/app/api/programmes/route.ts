import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sportProgrammes, programmeExercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const programmes = await db.select().from(sportProgrammes)
    .where(eq(sportProgrammes.userId, userId));

  const result = [];
  for (const prog of programmes) {
    const exercises = await db.select().from(programmeExercises)
      .where(eq(programmeExercises.programmeId, prog.id));
    result.push({ ...prog, exercises });
  }
  return NextResponse.json({ programmes: result });
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const [prog] = await db.insert(sportProgrammes).values({
    userId,
    name: body.name,
    description: body.description || "",
    daysPerWeek: body.daysPerWeek || 3,
    level: body.level || "beginner",
  }).returning();

  if (body.exercises && Array.isArray(body.exercises)) {
    for (const ex of body.exercises) {
      await db.insert(programmeExercises).values({
        programmeId: prog.id,
        exerciseId: ex.exerciseId || ex.id,
        exerciseName: ex.exerciseName || ex.name,
        bodyPart: ex.bodyPart,
        target: ex.target,
        equipment: ex.equipment || "",
        gifUrl: ex.gifUrl || "",
        sets: ex.sets || 3,
        reps: ex.reps || 10,
        day: ex.day || 1,
        orderIndex: ex.orderIndex || 0,
      });
    }
  }

  const exercises = await db.select().from(programmeExercises)
    .where(eq(programmeExercises.programmeId, prog.id));
  return NextResponse.json({ programme: { ...prog, exercises } });
}
