"use client";

import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const btnBase =
  "rounded px-1.5 py-0.5 text-xs font-medium transition-colors";
const inactive = "text-zinc-500 hover:text-zinc-800";
const active = "bg-zinc-100 text-zinc-900";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  function select(next: Lang) {
    setLang(next);
  }

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 text-zinc-400"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => select("en")}
        className={`${btnBase} ${lang === "en" ? active : inactive}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="text-xs text-zinc-300" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => select("zh")}
        className={`${btnBase} ${lang === "zh" ? active : inactive}`}
        aria-pressed={lang === "zh"}
      >
        中文
      </button>
    </div>
  );
}
