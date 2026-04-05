import type { Lang } from "@/lib/i18n/types";
import type { Cluster } from "@/types/cluster";
import type { LocalizedString } from "@/types/localized";

export function isBilingual(
  v: LocalizedString,
): v is { en: string; zh: string } {
  return typeof v === "object" && v !== null && "en" in v && "zh" in v;
}

export function pickLocalized(v: LocalizedString, lang: Lang): string {
  if (typeof v === "string") return v;
  return lang === "zh" ? v.zh : v.en;
}

export function flattenLocalized(v: LocalizedString): string {
  if (typeof v === "string") return v;
  return `${v.en} ${v.zh}`;
}

export function clusterSearchText(cluster: Cluster): string {
  const parts: LocalizedString[] = [
    cluster.title,
    ...(cluster.subtitle ? [cluster.subtitle] : []),
    cluster.summary,
    cluster.whyItMatters,
    ...cluster.takeaways,
    cluster.audience.pm,
    cluster.audience.developer,
    cluster.audience.studentJobSeeker,
  ];
  return parts.map(flattenLocalized).join(" ").toLowerCase();
}

/** First paragraph of localized text (for excerpts). */
export function firstParagraphExcerpt(
  v: LocalizedString,
  lang: Lang,
  max = 280,
): string {
  const text = pickLocalized(v, lang);
  const first =
    text
      .split(/\n\s*\n+/)
      .map((s) => s.trim())
      .find(Boolean) ?? "";
  return first.length > max ? `${first.slice(0, max).trim()}…` : first;
}
