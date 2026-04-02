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
  summary: string;
  takeaways: string[];
  whyItMatters: string;
  audience: AudienceBlocks;
  sourceIds: string[];
  relatedClusterIds: string[];
  draftId: string;
  featured?: boolean;
};
