export type AudienceBlocks = {
  pm: string;
  developer: string;
  studentJobSeeker: string;
};

export type Cluster = {
  id: string;
  /** Display label for cluster detail header (often mirrors theme). */
  clusterType: string;
  title: string;
  subtitle?: string;
  description?: string;
  /** Archive / filter theme key */
  theme: string;
  themes?: string[];
  tags?: string[];
  storyStatus?: string;
  clusterScore?: number;
  freshnessLabel?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  summary: string;
  takeaways: string[];
  whyItMatters: string;
  audience: AudienceBlocks;
  articleIds: string[];
  relatedClusterIds: string[];
  draftId?: string;
};
