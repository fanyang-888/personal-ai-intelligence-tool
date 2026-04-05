import type { Cluster } from "@/types/cluster";
import { getArticleById } from "@/lib/mock-data/articles";
import { getSourceById } from "@/lib/mock-data/sources";
import { clusterSearchText } from "@/lib/utils/localized-string";
import { sortByKeywordRelevance } from "@/lib/utils/score";

export type ArchiveFilters = {
  keyword: string;
  theme: string;
  sourceId: string;
  /** Ingest channel: cluster matches if any linked article/source uses this channel (default web). */
  channel: string;
};

function clusterTouchesChannel(cluster: Cluster, channel: string): boolean {
  if (!channel) return true;
  for (const aid of cluster.articleIds) {
    const art = getArticleById(aid);
    if (!art) continue;
    const s = getSourceById(art.sourceId);
    const ch = art.channel ?? s?.channel ?? "web";
    if (ch === channel) return true;
  }
  return false;
}

function clusterTouchesSource(cluster: Cluster, sourceId: string): boolean {
  if (!sourceId) return true;
  return cluster.articleIds.some((aid) => {
    const art = getArticleById(aid);
    return art?.sourceId === sourceId;
  });
}

export function filterClusters(clusters: Cluster[], filters: ArchiveFilters): Cluster[] {
  const kw = filters.keyword.trim().toLowerCase();
  const theme = filters.theme.trim().toLowerCase();
  const sourceId = filters.sourceId.trim();
  const channel = filters.channel.trim();

  let out = clusters.filter((c) => {
    if (theme && c.theme.toLowerCase() !== theme) return false;
    if (!clusterTouchesSource(c, sourceId)) return false;
    if (!clusterTouchesChannel(c, channel)) return false;
    if (kw) {
      const blob = clusterSearchText(c);
      if (!blob.includes(kw)) return false;
    }
    return true;
  });

  if (kw) {
    out = sortByKeywordRelevance(out, clusterSearchText, kw);
  }

  return out;
}

export function uniqueThemes(clusters: Cluster[]): string[] {
  return [...new Set(clusters.map((c) => c.theme))].sort();
}
