import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticateUser, sessionCookieName, signSession } from "../../../../lib/auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "sales", "analyst", "support"])
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  }

  const payload = bodySchema.safeParse(body);

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  }

  const user = await authenticateUser(payload.data.email, payload.data.password, payload.data.role);

  if (!user) {
    return NextResponse.json({ error: "The credentials did not match any demo account." }, { status: 401 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set({
    name: sessionCookieName(),
    value: await signSession(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}