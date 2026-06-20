import { NextResponse } from "next/server";

import { buildDashboardData } from "../../../../lib/demo-data";
import { forecastSales } from "../../../../lib/analytics";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = buildDashboardData(user.role);
  return NextResponse.json(forecastSales(dashboard.revenueSeries, user.role));
}