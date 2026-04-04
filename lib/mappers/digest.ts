import { getDraftById } from "@/lib/mock-data/drafts";
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
  const topClusters = getTopClusters(3);
  const featuredDraft =
    featured?.draftId != null ? getDraftById(featured.draftId) : undefined;
  const draftOfDay = featuredDraft;

  return {
    featured,
    topClusters,
    draftOfDay,
    featuredDraft,
  };
}
