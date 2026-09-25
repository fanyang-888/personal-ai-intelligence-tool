"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ROLES, roleLabel, usePreferredRole } from "@/lib/preferred-role";

export function RoleSelectorBanner() {
  const { lang } = useI18n();
  const [role, setRole] = usePreferredRole();
  const [editing, setEditing] = useState(false);

  if (role && !editing) {
    return (
      <p className="mb-6 flex flex-wrap items-center gap-x-2 text-sm [color:var(--text-muted)]">
        <span>
          {lang === "zh" ? "已为" : "Personalised for"}{" "}
          <strong className="font-semibold" style={{ color: "var(--sp-navy)" }}>
            {roleLabel(role, lang)}
          </strong>
          {lang === "zh" ? "定制" : ""}
        </span>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="underline-offset-4 hover:underline [color:var(--accent)]"
        >
          {lang === "zh" ? "更换" : "Change"}
        </button>
      </p>
    );
  }

  return (
    <div
      className="mb-6 rounded-xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--surface2)" }}
    >
      <p className="mb-3 text-sm font-medium" style={{ color: "var(--sp-navy)" }}>
        {lang === "zh" ? "你是？让我们为你个性化内容" : "Who are you? Let us personalise your feed"}
      </p>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={r === role}
            onClick={() => {
              setRole(r);
              setEditing(false);
            }}
            className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:border-[var(--sp-accent-mid)]"
            style={
              r === role
                ? { borderColor: "var(--accent)", color: "var(--accent)", fontWeight: 600 }
                : { borderColor: "var(--border)", color: "var(--text-muted)" }
            }
          >
            {roleLabel(r, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}
