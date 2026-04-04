import { getArticleById } from "@/lib/mock-data/articles";
import { getSourceById } from "@/lib/mock-data/sources";
import type { Cluster } from "@/types/cluster";

export type ArchiveResultRow = {
  id: string;
  title: string;
  theme: string;
  summarySnippet: string;
  sourceLabels: string;
};

const SNIPPET_LEN = 160;

export function mapClusterToArchiveRow(cluster: Cluster): ArchiveResultRow {
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

  const summarySnippet =
    cluster.summary.length <= SNIPPET_LEN
      ? cluster.summary
      : `${cluster.summary.slice(0, SNIPPET_LEN).trim()}…`;

  return {
    id: cluster.id,
    title: cluster.title,
    theme: cluster.theme,
    summarySnippet,
    sourceLabels: names.join(", ") || "—",
  };
}

export function mapClustersToArchiveRows(clusters: Cluster[]): ArchiveResultRow[] {
  return clusters.map(mapClusterToArchiveRow);
}
