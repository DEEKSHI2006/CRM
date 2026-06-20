import { buildDashboardData, type CustomerRisk, type Role } from "./demo-data";

export function forecastSales(revenueSeries: number[], role: Role) {
  const last = revenueSeries.slice(-4);
  const deltas = last.slice(1).map((value, index) => value - last[index]);
  const averageDelta = deltas.reduce((sum, value) => sum + value, 0) / Math.max(deltas.length, 1);
  const momentum = last[last.length - 1] + averageDelta;
  const roleBoost = role === "admin" ? 1.06 : role === "sales" ? 1.03 : role === "analyst" ? 1.08 : 0.99;
  const nextMonth = Math.round(momentum * roleBoost);
  const nextQuarter = Math.round(nextMonth * 3.15);
  const confidence = Math.min(97, Math.max(74, 88 + Math.round(averageDelta)));

  return {
    nextMonth,
    nextQuarter,
    confidence,
    headline:
      role === "sales"
        ? "Pipeline is strengthening with faster conversion in the mid-funnel."
        : "Revenue momentum is holding with healthy conversion and low volatility.",
    drivers: ["More late-stage deals", "Higher meeting-to-opportunity conversion", "Reduced churn drag"]
  };
}

export function scoreCustomerChurn(customer: CustomerRisk) {
  const inactivity = customer.daysInactive * 0.65;
  const tickets = customer.tickets * 6;
  const satisfactionPenalty = (100 - customer.nps) * 0.35;
  const engagementPenalty = (100 - customer.engagement) * 0.5;
  const accountValueAdjustment = Math.min(customer.mrr / 1000, 18) * 0.4;
  const rawScore = inactivity + tickets + satisfactionPenalty + engagementPenalty + accountValueAdjustment;
  const score = Math.round(Math.max(8, Math.min(96, rawScore)));

  return {
    score,
    band: score >= 70 ? "high" : score >= 45 ? "medium" : "low",
    intervention:
      score >= 70
        ? "Schedule an executive check-in, reset expectations, and offer a retention incentive."
        : score >= 45
          ? "Trigger a success review and renewal reminder."
          : "Maintain regular touchpoints and monitor usage trends.",
    signal: customer.daysInactive > 20 ? "declining engagement" : customer.tickets > 3 ? "support friction" : "healthy"
  };
}

export function buildAnalyticsSnapshot(role: Role) {
  const dashboard = buildDashboardData(role);
  return {
    forecast: forecastSales(dashboard.revenueSeries, role),
    churn: dashboard.risks
      .map((customer) => ({ customer, ...scoreCustomerChurn(customer) }))
      .sort((left, right) => right.score - left.score)
  };
}