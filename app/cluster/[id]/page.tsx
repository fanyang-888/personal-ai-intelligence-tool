import { notFound } from "next/navigation";
import { clusters, getClusterById } from "@/lib/mock-data/clusters";
import { getSourceById } from "@/lib/mock-data/sources";
import { ClusterPageView } from "@/components/cluster/cluster-page-view";

type ClusterPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return clusters.map((c) => ({ id: c.id }));
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params;
  const cluster = getClusterById(id);
  if (!cluster) notFound();

  const sources = cluster.sourceIds
    .map((sid) => getSourceById(sid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getSourceById>>[];

  const related = cluster.relatedClusterIds
    .map((rid) => getClusterById(rid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getClusterById>>[];

  return (
    <ClusterPageView cluster={cluster} sources={sources} related={related} />
  );
}
