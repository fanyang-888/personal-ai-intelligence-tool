import { notFound } from "next/navigation";
import { clusters, getClusterById } from "@/lib/mock-data/clusters";
import { getArticleById } from "@/lib/mock-data/articles";
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

  const articles = cluster.articleIds
    .map((aid) => getArticleById(aid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getArticleById>>[];

  const related =
    cluster.relatedClusterIds.length > 0
      ? (cluster.relatedClusterIds
          .map((rid) => getClusterById(rid))
          .filter(Boolean) as NonNullable<ReturnType<typeof getClusterById>>[])
      : [];

  return (
    <ClusterPageView cluster={cluster} articles={articles} related={related} />
  );
}
