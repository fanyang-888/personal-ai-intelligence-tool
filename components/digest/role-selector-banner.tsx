"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "sipply_preferred_role";

const ROLES = [
  { key: "pm", en: "Product Manager", zh: "产品经理" },
  { key: "developer", en: "Developer / Engineer", zh: "开发者 / 工程师" },
  { key: "studentJobSeeker", en: "Student / Job Seeker", zh: "学生 / 求职者" },
] as const;

export function RoleSelectorBanner() {
  const { lang } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if no role has been set yet
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setShow(true);
  }, []);

  if (!show) return null;

  function select(key: string) {
    localStorage.setItem(STORAGE_KEY, key);
    setShow(false);
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
            key={r.key}
            onClick={() => select(r.key)}
            className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:border-[var(--sp-accent-mid)]"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            {lang === "zh" ? r.zh : r.en}
          </button>
        ))}
      </div>
    </div>
  );
}
