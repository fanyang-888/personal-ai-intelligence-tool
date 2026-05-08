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
    <section className="rounded-2xl border px-6 py-8 text-center [border-color:var(--border)] [background:var(--surface)]">
      {state === "success" || state === "already" ? (
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">
            {state === "success" ? s.successHeading : s.alreadySubscribed}
          </p>
          {state === "success" && (
            <p className="text-sm [color:var(--text-muted)]">{s.successMessage}</p>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-foreground">
            {s.heading}
          </h2>
          <p className="mt-1 text-sm [color:var(--text-muted)]">{s.subheading}</p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.placeholder}
              disabled={state === "loading"}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 sm:w-72 [border-color:var(--border)] [background:var(--surface2)] [color:var(--text)] placeholder:[color:var(--text-muted)] focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded-lg px-5 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 [background:var(--accent)] hover:opacity-90 focus:ring-[var(--accent)]"
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
