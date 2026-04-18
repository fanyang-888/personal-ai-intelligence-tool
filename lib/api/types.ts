/**
 * TypeScript types matching the FastAPI response schemas.
 * These are API wire types — components use the existing domain types
 * (Cluster, Draft) after mapping.
 */

import type { LocalizedString } from "@/types/localized";

export type ApiLocalizedStr = { en: string; zh: string | null };

export type ApiAudienceBlocks = {
  pm: ApiLocalizedStr;
  developer: ApiLocalizedStr;
  studentJobSeeker: ApiLocalizedStr;
};

export type ApiArticleInCluster = {
  id: string;
  title: string;
  url: string;
  sourceName: string | null;
  publishedAt: string | null;
  excerpt: string | null;
};

export type ApiCluster = {
  id: string;
  clusterType: string;
  title: ApiLocalizedStr;
  theme: string;
  themes: string[];
  tags: string[];
  storyStatus: string;
  clusterScore: number | null;
  freshnessLabel: string;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  summary: ApiLocalizedStr;
  takeaways: ApiLocalizedStr[];
  whyItMatters: ApiLocalizedStr;
  audience: ApiAudienceBlocks;
  articleIds: string[];
  articles: ApiArticleInCluster[];
  relatedClusterIds: string[];
  draftId: string | null;
  articleCount: number;
  sourceCount: number;
};

export type ApiDigest = {
  date: string;
  featured: ApiCluster | null;
  topClusters: ApiCluster[];
  draftId: string | null;
};

export type ApiDraft = {
  id: string;
  clusterId: string | null;
  draftType: string;
  title: ApiLocalizedStr;
  generatedAt: string | null;
  hook: ApiLocalizedStr;
  summaryBlock: ApiLocalizedStr;
  takeaways: ApiLocalizedStr[];
  careerInterpretationBlock: ApiLocalizedStr;
  audienceWhyItMattersBlock: ApiLocalizedStr;
  closingBlock: ApiLocalizedStr | null;
  fullText: string;
  role: string | null;
};

export type ApiSearchResponse = {
  query: string;
  resultType: string;
  clusters: ApiArchiveClusterRow[];
  articles: ApiArchiveArticleRow[];
  total: number;
};

export type ApiArchiveClusterRow = {
  id: string;
  type: "cluster";
  title: string;
  title_zh: string | null;
  summary: string | null;
  summary_zh: string | null;
  tags: string[];
  theme: string;
  storyStatus: string;
  clusterScore: number | null;
  lastSeenAt: string | null;
  sourceCount: number;
};

export type ApiArchiveArticleRow = {
  id: string;
  type: "article";
  title: string;
  excerpt: string | null;
  sourceName: string | null;
  publishedAt: string | null;
  url: string;
};
