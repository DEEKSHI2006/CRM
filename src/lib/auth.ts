import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { demoUsers, type DemoUser, type Role } from "./demo-data";

export type SessionUser = Omit<DemoUser, "password">;

const COOKIE_NAME = "crm_session";
const secret = new TextEncoder().encode(
  process.env.CRM_AUTH_SECRET ?? "dev-secret-change-me-dev-secret-change-me"
);

export async function authenticateUser(email: string, password: string, role: Role): Promise<SessionUser | null> {
  const user = demoUsers.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password &&
      candidate.role === role
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...sessionUser } = user;
  return sessionUser;
}

export async function signSession(user: SessionUser) {
  return new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team,
    region: user.region
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readSession(token?: string): Promise<SessionUser | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as Role,
      team: String(payload.team ?? ""),
      region: String(payload.region ?? "")
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return readSession(token);
}

export function sessionCookieName() {
  return COOKIE_NAME;
}