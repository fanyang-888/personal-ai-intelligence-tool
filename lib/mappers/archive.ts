import type { Article } from "@/types/article";
import type { Lang } from "@/lib/i18n/types";
import { themeSelectLabel } from "@/lib/i18n/theme-display";
import { getArticleById } from "@/lib/mock-data/articles";
import { getClusterById } from "@/lib/mock-data/clusters";
import { getSourceById } from "@/lib/mock-data/sources";
import { pickLocalized } from "@/lib/utils/localized-string";
import type { Cluster } from "@/types/cluster";

export type ArchiveClusterRow = {
  kind: "cluster";
  id: string;
  title: string;
  /** Filter key (English canonical). */
  theme: string;
  /** Localized label for the theme badge. */
  themeLabel: string;
  summarySnippet: string;
  sourceLabels: string;
  /** From mock data when present (e.g. "Updated 2h ago"). */
  freshnessLabel?: string;
};

export type ArchiveArticleRow = {
  kind: "article";
  id: string;
  sourceName: string;
  title: string;
  url: string;
  excerptSnippet: string;
  clusterId: string;
  clusterTitle: string;
  /** Related cluster theme, localized for display. */
  themeLabel: string;
  publishedLabel: string;
};

export type ArchiveResultRow = ArchiveClusterRow | ArchiveArticleRow;

const SNIPPET_LEN = 160;

function formatPublishedAt(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
  }).format(d);
}

export function mapClusterToArchiveRow(
  cluster: Cluster,
  lang: Lang,
): ArchiveClusterRow {
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
    kind: "cluster",
    id: cluster.id,
    title: pickLocalized(cluster.title, lang),
    theme: cluster.theme,
    themeLabel: themeSelectLabel(cluster.theme, lang),
    summarySnippet,
    sourceLabels: names.join(", ") || "—",
    freshnessLabel: cluster.freshnessLabel?.trim() || undefined,
  };
}

export function mapClustersToArchiveRows(
  clusters: Cluster[],
  lang: Lang,
): ArchiveClusterRow[] {
  return clusters.map((c) => mapClusterToArchiveRow(c, lang));
}

export function mapArticleToArchiveRow(
  article: Article,
  lang: Lang,
): ArchiveArticleRow | null {
  const source = getSourceById(article.sourceId);
  const cluster = getClusterById(article.clusterId);
  if (!source || !cluster) return null;

  const excerpt =
    article.excerpt.length <= SNIPPET_LEN
      ? article.excerpt
      : `${article.excerpt.slice(0, SNIPPET_LEN).trim()}…`;

  return {
    kind: "article",
    id: article.id,
    sourceName: source.name,
    title: article.title,
    url: article.url,
    excerptSnippet: excerpt,
    clusterId: cluster.id,
    clusterTitle: pickLocalized(cluster.title, lang),
    themeLabel: themeSelectLabel(cluster.theme, lang),
    publishedLabel: formatPublishedAt(article.publishedAt, lang),
  };
}

export function mapArticlesToArchiveRows(
  articles: Article[],
  lang: Lang,
): ArchiveArticleRow[] {
  const rows: ArchiveArticleRow[] = [];
  for (const a of articles) {
    const row = mapArticleToArchiveRow(a, lang);
    if (row) rows.push(row);
  }
  return rows;
}
