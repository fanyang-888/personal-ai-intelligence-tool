import type { Cluster } from "@/types/cluster";
import { getSourceById } from "@/lib/mock-data/sources";
import { sortByKeywordRelevance } from "@/lib/utils/score";

export type ArchiveFilters = {
  keyword: string;
  theme: string;
  sourceId: string;
  /** Ingest channel: cluster matches if any linked source uses this channel (default web). */
  channel: string;
};

function clusterTouchesChannel(cluster: Cluster, channel: string): boolean {
  if (!channel) return true;
  return cluster.sourceIds.some((id) => {
    const s = getSourceById(id);
    const ch = s?.channel ?? "web";
    return ch === channel;
  });
}

export function filterClusters(clusters: Cluster[], filters: ArchiveFilters): Cluster[] {
  const kw = filters.keyword.trim().toLowerCase();
  const theme = filters.theme.trim().toLowerCase();
  const sourceId = filters.sourceId.trim();
  const channel = filters.channel.trim();

  let out = clusters.filter((c) => {
    if (theme && c.theme.toLowerCase() !== theme) return false;
    if (sourceId && !c.sourceIds.includes(sourceId)) return false;
    if (!clusterTouchesChannel(c, channel)) return false;
    if (kw) {
      const blob = `${c.title} ${c.subtitle ?? ""} ${c.summary}`.toLowerCase();
      if (!blob.includes(kw)) return false;
    }
    return true;
  });

  if (kw) {
    out = sortByKeywordRelevance(
      out,
      (c) => `${c.title} ${c.subtitle ?? ""} ${c.summary}`,
      kw,
    );
  }

  return out;
}

export function uniqueThemes(clusters: Cluster[]): string[] {
  return [...new Set(clusters.map((c) => c.theme))].sort();
}
