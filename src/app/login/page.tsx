import type { Metadata } from "next";

import { LoginForm } from "../../components/login-form";

export const metadata: Metadata = {
  title: "Login | Northstar CRM"
};

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-slate-50 md:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8">
          <div className="grid-overlay absolute inset-0 opacity-50" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                Northstar CRM Analytics
              </span>
              <div className="space-y-4">
                <h1 className="font-heading max-w-xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  Revenue intelligence for teams that need to move fast.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Log in with a role-specific demo account to explore live dashboard surfaces, predictive sales
                  analysis, churn scoring, PDF exports, and email notifications in one workflow.
                </p>
              </div>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Forecast trend</p>
                    <p className="mt-1 text-lg font-semibold text-white">Next 6 months</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    Demo graph
                  </span>
                </div>

                <svg viewBox="0 0 520 240" className="h-60 w-full" role="img" aria-label="Forecast trend chart">
                  <defs>
                    <linearGradient id="forecastLine" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="55%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="forecastFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <g opacity="0.25">
                    {[40, 80, 120, 160, 200].map((y) => (
                      <line key={y} x1="24" x2="496" y1={y} y2={y} stroke="#94a3b8" strokeDasharray="4 8" />
                    ))}
                  </g>

                  <path
                    d="M24 192 C 78 180, 116 152, 164 156 S 250 132, 294 120 S 382 84, 430 96 S 470 72, 496 54"
                    fill="none"
                    stroke="url(#forecastLine)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 192 C 78 180, 116 152, 164 156 S 250 132, 294 120 S 382 84, 430 96 S 470 72, 496 54 L 496 220 L 24 220 Z"
                    fill="url(#forecastFill)"
                  />

                  {[
                    [24, 192],
                    [112, 156],
                    [198, 148],
                    [294, 120],
                    [384, 92],
                    [496, 54]
                  ].map(([x, y], index) => (
                    <circle key={index} cx={x} cy={y} r="6.5" fill="#e2e8f0" stroke="#22d3ee" strokeWidth="3" />
                  ))}

                  <g fill="#94a3b8" fontSize="12">
                    <text x="24" y="232">Jan</text>
                    <text x="108" y="232">Feb</text>
                    <text x="192" y="232">Mar</text>
                    <text x="286" y="232">Apr</text>
                    <text x="374" y="232">May</text>
                    <text x="478" y="232">Jun</text>
                  </g>
                </svg>
              </div>

                <div className="grid gap-4 md:grid-cols-1">
                  {[
                    ["Sales forecast", "$5.2M next quarter"],
                    ["Churn risk", "Top 4 accounts flagged"],
                    ["Exports", "PDF reports on demand"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}