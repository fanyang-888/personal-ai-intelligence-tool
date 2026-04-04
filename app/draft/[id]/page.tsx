import { notFound } from "next/navigation";
import { drafts, getDraftById, getDraftBodies } from "@/lib/mock-data/drafts";
import { getClusterById } from "@/lib/mock-data/clusters";
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
  const clusterTitle = cluster?.title ?? draft.clusterId;
  const bodies = getDraftBodies(draft);

  return (
    <DraftPageView
      draft={draft}
      clusterTitle={clusterTitle}
      bodies={bodies}
      clusterId={cluster?.id ?? null}
    />
  );
}
