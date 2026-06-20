import type { DemoUser } from "./demo-data";

export type SessionUser = Omit<DemoUser, "password">;