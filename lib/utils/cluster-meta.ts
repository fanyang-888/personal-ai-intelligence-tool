import type { Article } from "@/types/article";
import type { Cluster } from "@/types/cluster";
import { clusters } from "@/lib/mock-data/clusters";

const WORDS_PER_MINUTE = 200;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Rough digest read time from cluster narrative fields (mock-only). */
export function estimateClusterReadMinutes(cluster: Cluster): number {
  const blob = [
    cluster.summary,
    cluster.subtitle ?? "",
    ...cluster.takeaways,
    cluster.whyItMatters,
    cluster.audience.pm,
    cluster.audience.developer,
    cluster.audience.studentJobSeeker,
  ].join(" ");
  const words = wordCount(blob);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type OutletDiversity = {
  articleCount: number;
  uniqueOutletCount: number;
};

export function getOutletDiversityFromArticles(articles: Article[]): OutletDiversity {
  const ids = new Set(articles.map((a) => a.sourceId));
  return {
    articleCount: articles.length,
    uniqueOutletCount: ids.size,
  };
}

/** Next cluster in score-ranked digest order; undefined if last or not found. */
export function getNextClusterInRankOrder(clusterId: string): Cluster | undefined {
  const sorted = [...clusters].sort(
    (a, b) => (b.clusterScore ?? 0) - (a.clusterScore ?? 0),
  );
  const i = sorted.findIndex((c) => c.id === clusterId);
  if (i === -1) return undefined;
  return sorted[i + 1];
}
