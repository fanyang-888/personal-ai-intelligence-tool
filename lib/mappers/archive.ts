/** Archive row types used by archive-page-client and related components. */

export type ArchiveClusterRow = {
  kind: "cluster";
  id: string;
  title: string;
  theme: string;
  themeLabel: string;
  summarySnippet: string;
  sourceLabels: string;
  clusterScore?: number;
  freshnessLabel?: string;
  dateKey: string; // YYYY-MM-DD for grouping
};

export type ArchiveResultRow = ArchiveClusterRow;
