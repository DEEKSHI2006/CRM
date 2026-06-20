"use client";

import { BrainCircuit, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import type { DashboardData } from "../lib/demo-data";

type ForecastResponse = {
  nextMonth: number;
  nextQuarter: number;
  confidence: number;
  headline: string;
  drivers: string[];
};

type ChurnResponse = {
  churn: Array<{
    customer: DashboardData["risks"][number];
    score: number;
    band: string;
    intervention: string;
    signal: string;
  }>;
};

export function PredictionPanel({ baseline }: { baseline: { revenueSeries: number[] } }) {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [churn, setChurn] = useState<ChurnResponse["churn"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [forecastResponse, churnResponse] = await Promise.all([
        fetch("/api/analytics/predict"),
        fetch("/api/analytics/churn")
      ]);

      const forecastPayload = (await forecastResponse.json()) as ForecastResponse;
      const churnPayload = (await churnResponse.json()) as ChurnResponse;

      if (!cancelled) {
        setForecast(forecastPayload);
        setChurn(churnPayload.churn);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [baseline.revenueSeries]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-200">
            <BrainCircuit size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Predictive sales analysis</p>
            <p className="text-sm text-slate-400">Model output refreshed from the backend API.</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          {loading || !forecast ? (
            <p className="text-sm text-slate-400">Loading forecast...</p>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Next quarter forecast</p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-white">${forecast.nextQuarter.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-right text-sm text-cyan-100">
                  Confidence {forecast.confidence}%
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{forecast.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {forecast.drivers.map((driver) => (
                  <span key={driver} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {driver}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rose-400/15 p-3 text-rose-200">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Customer churn prediction</p>
            <p className="text-sm text-slate-400">Top risk accounts ranked by the scoring service.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading && !churn.length ? (
            <p className="text-sm text-slate-400">Loading churn analysis...</p>
          ) : (
            churn.slice(0, 4).map((entry) => (
              <div key={entry.customer.company} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{entry.customer.company}</p>
                    <p className="text-xs text-slate-400">Owner: {entry.customer.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-100">{entry.score}% risk</p>
                    <p className="text-xs text-slate-400 capitalize">{entry.band} band</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{entry.intervention}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Signal: {entry.signal}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}