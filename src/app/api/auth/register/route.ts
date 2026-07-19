import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({
    email,
    passwordHash: hash,
    displayName: displayName || email.split("@")[0],
  }).returning();
  const token = signToken(user.id);
  const res = NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
  res.cookies.set("session", token, { httpOnly: true, path: "/", maxAge: 30 * 86400, sameSite: "lax" });
  return res;
}
