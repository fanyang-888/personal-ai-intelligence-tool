import { getDraftOfTheDay, getDraftById } from "@/lib/mock-data/drafts";
import { getFeaturedCluster, getTopClusters } from "@/lib/mock-data/clusters";
import type { Cluster } from "@/types/cluster";
import type { Draft } from "@/types/draft";

export type DigestView = {
  featured: Cluster | undefined;
  topClusters: Cluster[];
  draftOfDay: Draft | undefined;
  featuredDraft: Draft | undefined;
};

export function buildDigestView(): DigestView {
  const featured = getFeaturedCluster();
  const topClusters = getTopClusters(5);
  const draftOfDay = getDraftOfTheDay();
  const featuredDraft = featured ? getDraftById(featured.draftId) : undefined;

  return {
    featured,
    topClusters,
    draftOfDay,
    featuredDraft,
  };
}
