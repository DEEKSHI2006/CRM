import { NextResponse } from "next/server";

import { buildDashboardData } from "../../../../lib/demo-data";
import { scoreCustomerChurn } from "../../../../lib/analytics";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = buildDashboardData(user.role);
  const churn = dashboard.risks
    .map((customer) => ({ customer, ...scoreCustomerChurn(customer) }))
    .sort((left, right) => right.score - left.score);

  return NextResponse.json({ churn });
}