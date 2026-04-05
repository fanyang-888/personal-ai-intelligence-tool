import type { Lang } from "@/lib/i18n/types";
import { pickLocalized } from "@/lib/utils/localized-string";
import type { LocalizedString } from "@/types/localized";

/** Canonical theme filter values → display labels (option value stays English key). */
const THEME_LABELS: Record<string, LocalizedString> = {
  "AI & productivity": {
    en: "AI & productivity",
    zh: "AI 与生产力",
  },
  Research: { en: "Research", zh: "研究" },
  Infrastructure: { en: "Infrastructure", zh: "基础设施" },
  "Enterprise AI": { en: "Enterprise AI", zh: "企业 AI" },
};

export function themeSelectLabel(themeKey: string, lang: Lang): string {
  const row = THEME_LABELS[themeKey];
  if (row) return pickLocalized(row, lang);
  return themeKey;
}
