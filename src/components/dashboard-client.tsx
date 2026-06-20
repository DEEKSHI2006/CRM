"use client";

import { useState } from "react";
import { BadgeDollarSign, BellRing, Building2, ShieldCheck, Sparkles, Users } from "lucide-react";

import { ExportReportButton } from "./export-report-button";
import { ThemeToggle } from "./theme-toggle";
import { LogoutButton } from "./logout-button";
import { EmailComposer } from "./email-composer";
import { MiniBarChart, MiniLineChart } from "./charts";
import { PredictionPanel } from "./prediction-panel";
import { type DashboardData } from "../lib/demo-data";

type SessionUser = {
  name: string;
  email: string;
  role: "admin" | "sales" | "analyst" | "support";
  team: string;
  region: string;
};

type Props = {
  user: SessionUser;
  dashboard: DashboardData;
};

const toneMap = {
  cyan: "from-cyan-400/20 to-cyan-500/5 text-cyan-100 border-cyan-300/20",
  violet: "from-violet-400/20 to-violet-500/5 text-violet-100 border-violet-300/20",
  emerald: "from-emerald-400/20 to-emerald-500/5 text-emerald-100 border-emerald-300/20",
  amber: "from-amber-400/20 to-amber-500/5 text-amber-100 border-amber-300/20"
} as const;

const iconMap = [BadgeDollarSign, Users, ShieldCheck, BellRing];

const activityToneClasses = {
  cyan: "bg-cyan-400",
  violet: "bg-violet-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400"
} as const;

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", description: "Overview and KPIs", icon: Building2 },
  { id: "predictive-ai", label: "Predictive AI", description: "Sales and churn models", icon: Sparkles },
  { id: "security", label: "Security", description: "Roles and access control", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", description: "Email and alerts", icon: BellRing },
  { id: "revenue", label: "Revenue", description: "Pipeline and forecast", icon: BadgeDollarSign },
  { id: "customers", label: "Customers", description: "Risk and health scores", icon: Users }
] as const;

type SidebarId = (typeof sidebarItems)[number]["id"];

export function DashboardClient({ user, dashboard }: Props) {
  const [activeSection, setActiveSection] = useState<SidebarId>("dashboard");

  return (
    <main className="min-h-screen p-4 text-slate-50 md:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 xl:grid-cols-[260px_1fr]">
        <aside className="glass-panel hidden rounded-[2rem] p-5 xl:flex xl:flex-col">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="font-heading text-2xl font-semibold text-white">Northstar CRM</p>
            <p className="text-sm text-slate-400">Analytics control center</p>
          </div>

          <nav className="mt-6 space-y-2 text-sm text-slate-300">
            {sidebarItems.map(({ id, label, description, icon: Icon }) => {
              const isActive = activeSection === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    isActive ? "bg-white/8 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.18)]" : "hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-cyan-200" : "text-slate-400"} />
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-slate-500">{description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Logged in as</p>
            <p className="mt-2 font-semibold text-white">{user.name}</p>
            <p className="text-sm text-slate-400">
              {user.team} - {user.region}
            </p>
          </div>
        </aside>

        <section className="glass-panel rounded-[2rem] p-4 md:p-6 lg:p-8">
          <div className="grid gap-6">
            <header className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">CRM dashboard</p>
                <h1 className="font-heading mt-2 text-3xl font-semibold text-white md:text-5xl">
                  Revenue visibility, churn risk, and workflow automation.
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  This workspace combines role-based access, predictive sales analysis, customer churn scoring, PDF
                  exports, and email notifications inside a single dashboard experience.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <ThemeToggle />
                <ExportReportButton />
                <LogoutButton />
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboard.metrics.map((metric, index) => {
                const Icon = iconMap[index % iconMap.length];
                return (
                  <article
                    key={metric.label}
                    className={`rounded-[1.5rem] border bg-gradient-to-br p-5 shadow-glow ${toneMap[metric.tone]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-300">{metric.label}</p>
                        <p className="font-heading mt-3 text-4xl font-semibold text-white">{metric.value}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-cyan-100/80">{metric.change}</p>
                  </article>
                );
              })}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
              <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                {activeSection === "dashboard" && (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Revenue trend</p>
                        <p className="text-sm text-slate-400">Weighted forecasting for the next six months.</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        Updated just now
                      </div>
                    </div>
                    <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                      <MiniLineChart values={dashboard.revenueSeries} />
                    </div>
                  </>
                )}

                {activeSection === "predictive-ai" && <PredictionPanel baseline={dashboard} />}

                {activeSection === "security" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Security and access control</p>
                      <p className="text-sm text-slate-400">
                        Session-based login protects the dashboard and API routes by role.
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        ["Active role", user.role],
                        ["Team", user.team],
                        ["Region", user.region],
                        ["Session scope", "HTTP-only cookie"]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                          <p className="mt-2 text-sm font-medium text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-slate-300">
                      Every analytics endpoint checks the current user session before returning data.
                    </p>
                  </div>
                )}

                {activeSection === "notifications" && <EmailComposer defaults={dashboard.emailDefaults} />}

                {activeSection === "revenue" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Revenue and pipeline</p>
                      <p className="text-sm text-slate-400">Pipeline mix and forecast from the CRM model.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                      <MiniBarChart
                        values={dashboard.pipeline.map((stage) => stage.value)}
                        colors={dashboard.pipeline.map((stage) => stage.tone)}
                      />
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      Forecast snapshot: next month at ${Math.round(dashboard.revenueSeries.at(-1) ?? 0).toLocaleString()}.
                    </div>
                  </div>
                )}

                {activeSection === "customers" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Customer health</p>
                      <p className="text-sm text-slate-400">Highest-risk accounts are surfaced here.</p>
                    </div>
                    {dashboard.activities.slice(0, 2).map((activity) => (
                      <div key={activity.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <p className="font-medium text-white">{activity.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{activity.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div>
                  <p className="text-sm font-semibold text-white">Recent activity</p>
                  <p className="text-sm text-slate-400">Operational events pulled from the CRM event stream.</p>
                </div>

                <div className="mt-4 space-y-3">
                  {dashboard.activities.map((activity) => (
                    <div
                      key={activity.title}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      <span className={`mt-1 h-3 w-3 rounded-full ${activityToneClasses[activity.tone]}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{activity.title}</p>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{activity.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}