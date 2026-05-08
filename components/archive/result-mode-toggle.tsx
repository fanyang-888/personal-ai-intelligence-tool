"use client";

import { useI18n } from "@/lib/i18n";

export type ArchiveResultMode = "clusters" | "articles";

type ResultModeToggleProps = {
  value: ArchiveResultMode;
  onChange: (mode: ArchiveResultMode) => void;
};

export function ResultModeToggle({ value, onChange }: ResultModeToggleProps) {
  const { t } = useI18n();

  const base =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
  const active = "[background:var(--surface)] text-foreground shadow-sm";
  const idle = "[color:var(--text-muted)] hover:text-foreground";

  return (
    <div
      className="mb-6"
      role="radiogroup"
      aria-label={t.archive.resultModeGroupAria}
    >
      <div className="inline-flex rounded-lg border [border-color:var(--border)] [background:var(--surface2)] p-1">
        <button
          type="button"
          role="radio"
          aria-checked={value === "clusters"}
          className={`${base} ${value === "clusters" ? active : idle}`}
          onClick={() => onChange("clusters")}
        >
          {t.archive.resultModeClusters}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={value === "articles"}
          className={`${base} ${value === "articles" ? active : idle}`}
          onClick={() => onChange("articles")}
        >
          {t.archive.resultModeArticles}
        </button>
      </div>
    </div>
  );
}
