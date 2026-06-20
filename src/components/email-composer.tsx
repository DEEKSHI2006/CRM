"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { DashboardData } from "../lib/demo-data";

export function EmailComposer({ defaults }: { defaults: DashboardData["emailDefaults"] }) {
  const [to, setTo] = useState(defaults.to);
  const [subject, setSubject] = useState(defaults.subject);
  const [message, setMessage] = useState(defaults.message);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"neutral" | "success" | "error">("neutral");
  const [busy, setBusy] = useState(false);

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    setStatusTone("neutral");

    const response = await fetch("/api/notifications/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message })
    });

    const payload = (await response.json()) as { error?: string; mode?: string; preview?: { to?: string; subject?: string } };
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error ?? "Email failed.");
      setStatusTone("error");
      return;
    }

    if (payload.mode === "preview") {
      setStatus(`Preview generated for ${payload.preview?.to ?? to}. Configure SMTP to send live email.`);
    } else {
      setStatus(`Notification sent to ${to}.`);
      setTo(defaults.to);
      setSubject(defaults.subject);
      setMessage(defaults.message);
    }

    setStatusTone("success");
  };

  const statusClass =
    statusTone === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
      : statusTone === "error"
        ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
        : "border-white/10 bg-white/5 text-slate-300";

  return (
    <form onSubmit={submitEmail} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-sm font-semibold text-white">Email notifications</p>
        <p className="mt-1 text-sm text-slate-400">Send a follow-up, alert, or summary without leaving the dashboard.</p>
      </div>

      <label className="grid gap-2 text-sm text-slate-300">
        To
        <input
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-50 outline-none focus:border-cyan-300/50"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-300">
        Subject
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-50 outline-none focus:border-cyan-300/50"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-300">
        Message
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none focus:border-cyan-300/50"
        />
      </label>

      {status ? <p className={`rounded-2xl border px-4 py-3 text-sm ${statusClass}`}>{status}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />
        {busy ? "Sending..." : "Send notification"}
      </button>
    </form>
  );
}