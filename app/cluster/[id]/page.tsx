import Link from "next/link";
import { notFound } from "next/navigation";
import { getClusterById } from "@/lib/mock-data/clusters";
import { getSourceById } from "@/lib/mock-data/sources";
import { ClusterHeader } from "@/components/cluster/cluster-header";
import { TakeawayList } from "@/components/cluster/takeaway-list";
import { WhyItMattersBlock } from "@/components/cluster/why-it-matters-block";
import { AudienceBlocksSection } from "@/components/cluster/audience-blocks";
import { CoveredSourcesList } from "@/components/cluster/covered-sources-list";
import { RelatedStories } from "@/components/cluster/related-stories";
import { SectionTitle } from "@/components/shared/section-title";

type ClusterPageProps = {
  params: Promise<{ id: string }>;
};

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
    <article>
      <ClusterHeader cluster={cluster} />

      <section className="mb-6">
        <SectionTitle>Summary</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground">{cluster.summary}</p>
      </section>

      <TakeawayList items={cluster.takeaways} />
      <WhyItMattersBlock text={cluster.whyItMatters} />
      <AudienceBlocksSection audience={cluster.audience} />
      <CoveredSourcesList sources={sources} />
      <RelatedStories clusters={related} />

      <section className="rounded border border-zinc-200 p-4">
        <SectionTitle>Draft</SectionTitle>
        <p className="mb-3 text-sm text-zinc-600">
          Open the linked draft for a shareable brief and career-oriented notes.
        </p>
        <Link
          href={`/draft/${cluster.draftId}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          Open draft
        </Link>
      </section>
    </article>
  );
}
