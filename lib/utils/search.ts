import type { Cluster } from "@/types/cluster";
import { sortByKeywordRelevance } from "@/lib/utils/score";

export type ArchiveFilters = {
  keyword: string;
  theme: string;
  sourceId: string;
};

export function filterClusters(clusters: Cluster[], filters: ArchiveFilters): Cluster[] {
  const kw = filters.keyword.trim().toLowerCase();
  const theme = filters.theme.trim().toLowerCase();
  const sourceId = filters.sourceId.trim();

  let out = clusters.filter((c) => {
    if (theme && c.theme.toLowerCase() !== theme) return false;
    if (sourceId && !c.sourceIds.includes(sourceId)) return false;
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
