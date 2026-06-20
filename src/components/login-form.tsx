"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { demoUsers, roleLabels, type Role } from "../lib/demo-data";

const roles: Role[] = ["admin", "sales", "analyst", "support"];

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState(demoUsers[0].password);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const selectedDemo = useMemo(() => demoUsers.find((user) => user.role === role), [role]);

  const fillDemo = () => {
    if (!selectedDemo) {
      return;
    }

    setEmail(selectedDemo.email);
    setPassword(selectedDemo.password);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setPending(false);
      setError(payload.error ?? "Login failed.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20">
          <ShieldCheck size={28} />
        </div>
        <h2 className="font-heading text-3xl font-semibold text-white">Sign in to your role-based workspace</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          Each demo user opens a different dashboard lens. Pick the role you want to explore and the UI will adapt to
          it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                role === item
                  ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-semibold capitalize">{roleLabels[item]}</div>
              <div className="text-xs text-slate-400">Demo access role</div>
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
              placeholder="name@company.com"
              type="email"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/50"
              placeholder="Password"
              type="password"
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Enter dashboard"}
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={fillDemo}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
          >
            Load demo account
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Demo credentials</p>
        <p className="mt-2 leading-7">
          admin@northstarcrm.com / Admin123! <br /> sales@northstarcrm.com / Sales123! <br />
          analyst@northstarcrm.com / Analyst123! <br /> support@northstarcrm.com / Support123!
        </p>
      </div>
    </div>
  );
}