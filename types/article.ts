import type { SourceChannel } from "@/types/source";

export type Article = {
  id: string;
  clusterId: string;
  sourceId: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  themes: string[];
  organizationName?: string;
  channel?: SourceChannel;
  credibilityLabel?: string;
};
