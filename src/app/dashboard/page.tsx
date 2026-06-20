import { redirect } from "next/navigation";

import { DashboardClient } from "../../components/dashboard-client";
import { buildDashboardData } from "../../lib/demo-data";
import { getCurrentUser } from "../../lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const dashboard = buildDashboardData(user.role);

  return <DashboardClient user={user} dashboard={dashboard} />;
}