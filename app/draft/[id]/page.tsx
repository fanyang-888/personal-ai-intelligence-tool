import { notFound } from "next/navigation";
import { drafts, getDraftById } from "@/lib/mock-data/drafts";
import {
  getClusterById,
  getFeaturedCluster,
} from "@/lib/mock-data/clusters";
import { DraftPageView } from "@/components/draft/draft-page-view";
import type { Cluster } from "@/types/cluster";

type DraftPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return drafts.map((d) => ({ id: d.id }));
}

function excerptClusterSummary(cluster: Cluster | undefined, max = 280): string {
  if (!cluster?.summary) return "";
  const first =
    cluster.summary
      .split(/\n\s*\n+/)
      .map((s) => s.trim())
      .find(Boolean) ?? "";
  return first.length > max ? `${first.slice(0, max).trim()}…` : first;
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { id } = await params;
  const draft = getDraftById(id);
  if (!draft) notFound();

  const cluster = getClusterById(draft.clusterId);
  const featured = getFeaturedCluster();
  const isDraftOfDay = featured?.draftId === draft.id;
  const clusterTitle = cluster?.title ?? draft.clusterId;

  return (
    <DraftPageView
      draft={draft}
      isDraftOfDay={isDraftOfDay}
      clusterId={draft.clusterId}
      clusterTitle={clusterTitle}
      clusterExists={!!cluster}
      clusterSummaryExcerpt={excerptClusterSummary(cluster)}
    />
  );
}
