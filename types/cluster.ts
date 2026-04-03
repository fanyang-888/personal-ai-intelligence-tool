export type AudienceBlocks = {
  pm: string;
  developer: string;
  studentJobSeeker: string;
};

export type Cluster = {
  id: string;
  title: string;
  subtitle?: string;
  theme: string;
  /** Short tags for digest cards (optional mock) */
  tags?: string[];
  /** e.g. Emerging, Breaking, Stable (optional mock) */
  storyStatus?: string;
  /** Display rank 0–100 (optional mock) */
  clusterScore?: number;
  /** e.g. "Updated 3h ago" (optional mock) */
  freshnessLabel?: string;
  summary: string;
  takeaways: string[];
  whyItMatters: string;
  audience: AudienceBlocks;
  sourceIds: string[];
  relatedClusterIds: string[];
  draftId: string;
  featured?: boolean;
};
