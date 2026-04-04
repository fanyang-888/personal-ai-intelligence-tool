import type { Lang } from "@/lib/i18n/types";

const localeForLang: Record<Lang, string> = {
  en: "en-US",
  zh: "zh-CN",
};

export function formatDigestDate(
  date: Date = new Date(),
  lang: Lang = "en",
): string {
  return new Intl.DateTimeFormat(localeForLang[lang], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
