"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { postSubscribe } from "@/lib/api";

type State = "idle" | "loading" | "success" | "already" | "error";

export function SubscribeBar() {
  const { t } = useI18n();
  const s = t.subscribe;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await postSubscribe(email.trim());
      setState(res.status === "already_subscribed" ? "already" : "success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
      {state === "success" || state === "already" ? (
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {state === "success" ? s.successHeading : s.alreadySubscribed}
          </p>
          {state === "success" && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.successMessage}</p>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {s.heading}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.subheading}</p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.placeholder}
              disabled={state === "loading"}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 sm:w-72 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {state === "loading" ? "…" : s.cta}
            </button>
          </form>

          {state === "error" && (
            <p className="mt-3 text-xs text-red-500">{s.errorMessage}</p>
          )}
        </>
      )}
    </section>
  );
}
