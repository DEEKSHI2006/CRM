export type Role = "admin" | "sales" | "analyst" | "support";

export type DemoUser = {
  name: string;
  email: string;
  password: string;
  role: Role;
  team: string;
  region: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
};

export type Activity = {
  title: string;
  detail: string;
  time: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
};

export type PipelineStage = {
  label: string;
  value: number;
  tone: string;
};

export type CustomerRisk = {
  company: string;
  owner: string;
  mrr: number;
  daysInactive: number;
  tickets: number;
  nps: number;
  engagement: number;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  revenueSeries: number[];
  pipeline: PipelineStage[];
  activities: Activity[];
  risks: CustomerRisk[];
  emailDefaults: {
    to: string;
    subject: string;
    message: string;
  };
};

export const demoUsers: DemoUser[] = [
  {
    name: "Ava Morgan",
    email: "admin@northstarcrm.com",
    password: "Admin123!",
    role: "admin",
    team: "Executive Ops",
    region: "Global"
  },
  {
    name: "Noah Patel",
    email: "sales@northstarcrm.com",
    password: "Sales123!",
    role: "sales",
    team: "Revenue",
    region: "North America"
  },
  {
    name: "Mia Chen",
    email: "analyst@northstarcrm.com",
    password: "Analyst123!",
    role: "analyst",
    team: "Insights",
    region: "EMEA"
  },
  {
    name: "Ethan Reed",
    email: "support@northstarcrm.com",
    password: "Support123!",
    role: "support",
    team: "Customer Success",
    region: "APAC"
  }
];

const revenueSeries = [32, 35, 38, 41, 47, 52, 58, 62, 67, 71, 76, 84];

const pipeline = [
  { label: "Prospecting", value: 18, tone: "#60a5fa" },
  { label: "Qualified", value: 28, tone: "#22d3ee" },
  { label: "Proposal", value: 22, tone: "#a78bfa" },
  { label: "Negotiation", value: 16, tone: "#f472b6" },
  { label: "Closed Won", value: 34, tone: "#34d399" }
];

const activities = [
  { title: "Enterprise renewal secured", detail: "Orbit Labs renewed for another 24 months.", time: "8 min ago", tone: "emerald" },
  { title: "Churn alert triggered", detail: "Atlas Retail shows a rising risk score on one account.", time: "36 min ago", tone: "amber" },
  { title: "Forecast updated", detail: "Pipeline model lifted next quarter by 9.8%.", time: "1 hour ago", tone: "cyan" },
  { title: "Email sequence launched", detail: "Retention campaign sent to 128 at-risk customers.", time: "3 hours ago", tone: "violet" }
];

const risks = [
  { company: "Northwind", owner: "Mia Chen", mrr: 18400, daysInactive: 21, tickets: 4, nps: 41, engagement: 33 },
  { company: "Helio Freight", owner: "Noah Patel", mrr: 25200, daysInactive: 17, tickets: 2, nps: 58, engagement: 46 },
  { company: "Vertex Health", owner: "Ava Morgan", mrr: 30800, daysInactive: 33, tickets: 6, nps: 29, engagement: 22 },
  { company: "Blue River", owner: "Ethan Reed", mrr: 14100, daysInactive: 12, tickets: 1, nps: 69, engagement: 53 }
];

const dashboardByRole: Record<Role, DashboardMetric[]> = {
  admin: [
    { label: "ARR", value: "$4.8M", change: "+18.4%", tone: "cyan" },
    { label: "Pipeline", value: "$2.1M", change: "+11.9%", tone: "violet" },
    { label: "Win rate", value: "67%", change: "+3.2%", tone: "emerald" },
    { label: "Churn risk", value: "6.4%", change: "-1.1%", tone: "amber" }
  ],
  sales: [
    { label: "Quota progress", value: "84%", change: "+12.8%", tone: "cyan" },
    { label: "New pipeline", value: "$860K", change: "+9.1%", tone: "violet" },
    { label: "Meetings booked", value: "42", change: "+8", tone: "emerald" },
    { label: "Deal risk", value: "Low", change: "-2.4%", tone: "amber" }
  ],
  analyst: [
    { label: "Forecast", value: "$5.2M", change: "+14.7%", tone: "cyan" },
    { label: "Confidence", value: "92%", change: "+2.1%", tone: "violet" },
    { label: "Conversion", value: "31%", change: "+4.6%", tone: "emerald" },
    { label: "At-risk accounts", value: "12", change: "-3", tone: "amber" }
  ],
  support: [
    { label: "CSAT", value: "4.7/5", change: "+0.2", tone: "cyan" },
    { label: "Open tickets", value: "28", change: "-6", tone: "violet" },
    { label: "Retention", value: "94%", change: "+1.4%", tone: "emerald" },
    { label: "Escalations", value: "3", change: "-1", tone: "amber" }
  ]
};

const emailDefaultsByRole: Record<Role, DashboardData["emailDefaults"]> = {
  admin: {
    to: "leadership@northstarcrm.com",
    subject: "Weekly CRM performance digest",
    message: "Attached is the latest sales, churn, and forecast summary for executive review."
  },
  sales: {
    to: "team@northstarcrm.com",
    subject: "Pipeline follow-up reminders",
    message: "Sending a targeted follow-up sequence to advance the hottest opportunities."
  },
  analyst: {
    to: "insights@northstarcrm.com",
    subject: "Model refresh completed",
    message: "Predictive sales and churn analysis have been refreshed with the latest activity."
  },
  support: {
    to: "success@northstarcrm.com",
    subject: "Customer health review",
    message: "Sharing the latest risk list so the team can intervene on vulnerable accounts."
  }
};

export function buildDashboardData(role: Role): DashboardData {
  return {
    metrics: dashboardByRole[role],
    revenueSeries,
    pipeline,
    activities,
    risks,
    emailDefaults: emailDefaultsByRole[role]
  };
}

export const roleLabels: Record<Role, string> = {
  admin: "Executive",
  sales: "Sales",
  analyst: "Analytics",
  support: "Customer Success"
};