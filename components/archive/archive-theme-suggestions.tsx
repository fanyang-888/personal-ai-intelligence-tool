"use client";

import { useI18n } from "@/lib/i18n";
import { themeSelectLabel } from "@/lib/i18n/theme-display";

type ArchiveThemeSuggestionsProps = {
  themes: string[];
  onPickTheme: (canonicalTheme: string) => void;
};

export function ArchiveThemeSuggestions({
  themes,
  onPickTheme,
}: ArchiveThemeSuggestionsProps) {
  const { t, lang } = useI18n();

  if (themes.length === 0) {
    return null;
  }

  return (
    <div className="text-center">
      <p className="text-sm [color:var(--text-muted)]">{t.archive.suggestThemesLead}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {themes.map((th) => (
          <button
            key={th}
            type="button"
            onClick={() => onPickTheme(th)}
            className="rounded-full border [border-color:var(--border)] [background:var(--surface)] px-3 py-1.5 text-sm [color:var(--text-muted)] transition-colors hover:border-emerald-600/50 hover:bg-emerald-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            {themeSelectLabel(th, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}
