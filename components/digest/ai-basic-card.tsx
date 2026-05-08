"use client";

import { useState } from "react";
import { getDailyBasic, getNextBasic } from "@/lib/data/ai-basics";
import { useI18n } from "@/lib/i18n";

const LABELS = {
  en: {
    sectionTitle: "AI Basic of the Day",
    definition: "Definition",
    whyItMatters: "Why it matters",
    example: "Example",
    next: "Next concept →",
  },
  zh: {
    sectionTitle: "每日 AI 基础概念",
    definition: "定义",
    whyItMatters: "为什么重要",
    example: "例子",
    next: "下一个概念 →",
  },
};

export function AIBasicCard() {
  const { lang } = useI18n();
  const labels = LABELS[lang];

  const [basic, setBasic] = useState(() => getDailyBasic());

  return (
    <section aria-label={labels.sectionTitle}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {labels.sectionTitle}
      </h2>

      <div className="rounded-xl border [border-color:var(--border)] [background:var(--surface)] p-5 shadow-sm">
        {/* Concept name */}
        <p className="mb-3 inline-block rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          {lang === "zh" ? basic.concept_zh : basic.concept}
        </p>

        {/* Definition */}
        <div className="mb-3">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide [color:var(--text-muted)]">
            {labels.definition}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {lang === "zh" ? basic.definition_zh : basic.definition}
          </p>
        </div>

        {/* Why it matters */}
        <div className="mb-3">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide [color:var(--text-muted)]">
            {labels.whyItMatters}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {lang === "zh" ? basic.whyItMatters_zh : basic.whyItMatters}
          </p>
        </div>

        {/* Example */}
        <div className="mb-4">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide [color:var(--text-muted)]">
            {labels.example}
          </p>
          <p className="text-sm leading-relaxed [color:var(--text-muted)] italic">
            {lang === "zh" ? basic.example_zh : basic.example}
          </p>
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => setBasic((prev) => getNextBasic(prev.id))}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
        >
          {labels.next}
        </button>
      </div>
    </section>
  );
}
