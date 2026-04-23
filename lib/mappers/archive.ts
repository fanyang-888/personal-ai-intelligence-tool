/** Archive row types used by archive-page-client and related components. */

export type ArchiveClusterRow = {
  kind: "cluster";
  id: string;
  title: string;
  theme: string;
  themeLabel: string;
  summarySnippet: string;
  sourceLabels: string;
  freshnessLabel?: string;
  dateKey: string; // YYYY-MM-DD for grouping
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
  themeLabel: string;
  publishedLabel: string;
  dateKey: string; // YYYY-MM-DD for grouping
};

export type ArchiveResultRow = ArchiveClusterRow | ArchiveArticleRow;
