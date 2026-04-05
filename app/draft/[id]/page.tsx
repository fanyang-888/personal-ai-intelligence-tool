import { notFound } from "next/navigation";
import { drafts, getDraftById } from "@/lib/mock-data/drafts";
import {
  getClusterById,
  getFeaturedCluster,
} from "@/lib/mock-data/clusters";
import { DraftPageView } from "@/components/draft/draft-page-view";

type DraftPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return drafts.map((d) => ({ id: d.id }));
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { id } = await params;
  const draft = getDraftById(id);
  if (!draft) notFound();

  const cluster = getClusterById(draft.clusterId);
  const featured = getFeaturedCluster();
  const isDraftOfDay = featured?.draftId === draft.id;
  const clusterTitle = cluster?.title ?? draft.clusterId;
  const clusterTags = cluster?.tags ?? cluster?.themes ?? [];

  return (
    <DraftPageView
      draft={draft}
      isDraftOfDay={isDraftOfDay}
      clusterId={draft.clusterId}
      clusterTitle={clusterTitle}
      clusterExists={!!cluster}
      clusterSummary={cluster?.summary ?? ""}
      clusterTags={clusterTags}
    />
  );
}
