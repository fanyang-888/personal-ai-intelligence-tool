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
  const names = cluster.sourceIds
    .map((id) => getSourceById(id)?.name)
    .filter(Boolean) as string[];

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
