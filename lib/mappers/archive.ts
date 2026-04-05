import type { Lang } from "@/lib/i18n/types";
import { themeSelectLabel } from "@/lib/i18n/theme-display";
import { getArticleById } from "@/lib/mock-data/articles";
import { getSourceById } from "@/lib/mock-data/sources";
import { pickLocalized } from "@/lib/utils/localized-string";
import type { Cluster } from "@/types/cluster";

export type ArchiveResultRow = {
  id: string;
  title: string;
  /** Filter key (English canonical). */
  theme: string;
  /** Localized label for the theme badge. */
  themeLabel: string;
  summarySnippet: string;
  sourceLabels: string;
};

const SNIPPET_LEN = 160;

export function mapClusterToArchiveRow(
  cluster: Cluster,
  lang: Lang,
): ArchiveResultRow {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const aid of cluster.articleIds) {
    const art = getArticleById(aid);
    if (!art) continue;
    const s = getSourceById(art.sourceId);
    const n = s?.name;
    if (n && !seen.has(n)) {
      seen.add(n);
      names.push(n);
    }
  }

  const summaryText = pickLocalized(cluster.summary, lang);
  const summarySnippet =
    summaryText.length <= SNIPPET_LEN
      ? summaryText
      : `${summaryText.slice(0, SNIPPET_LEN).trim()}…`;

  return {
    id: cluster.id,
    title: pickLocalized(cluster.title, lang),
    theme: cluster.theme,
    themeLabel: themeSelectLabel(cluster.theme, lang),
    summarySnippet,
    sourceLabels: names.join(", ") || "—",
  };
}

export function mapClustersToArchiveRows(
  clusters: Cluster[],
  lang: Lang,
): ArchiveResultRow[] {
  return clusters.map((c) => mapClusterToArchiveRow(c, lang));
}
