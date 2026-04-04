"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ClusterHeader } from "@/components/cluster/cluster-header";
import { TakeawayList } from "@/components/cluster/takeaway-list";
import { WhyItMattersBlock } from "@/components/cluster/why-it-matters-block";
import { AudienceBlocksSection } from "@/components/cluster/audience-blocks";
import { CoveredSourcesList } from "@/components/cluster/covered-sources-list";
import { RelatedStories } from "@/components/cluster/related-stories";
import { SectionTitle } from "@/components/shared/section-title";
import type { Cluster } from "@/types/cluster";
import type { Source } from "@/types/source";

type ClusterPageViewProps = {
  cluster: Cluster;
  sources: Source[];
  related: Cluster[];
};

export function ClusterPageView({
  cluster,
  sources,
  related,
}: ClusterPageViewProps) {
  const { t } = useI18n();

  return (
    <article>
      <ClusterHeader cluster={cluster} />

      <p
        className="mb-4 rounded-md border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs leading-relaxed text-zinc-600"
        role="note"
      >
        {t.cluster.contentOriginalLanguageHint}
      </p>

      <section className="mb-6">
        <SectionTitle>{t.cluster.summary}</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground">{cluster.summary}</p>
      </section>

      <TakeawayList items={cluster.takeaways} />
      <WhyItMattersBlock text={cluster.whyItMatters} />
      <AudienceBlocksSection audience={cluster.audience} />
      <CoveredSourcesList sources={sources} />
      <RelatedStories clusters={related} />

      <section className="rounded border border-zinc-200 p-4">
        <SectionTitle>{t.cluster.draftSectionTitle}</SectionTitle>
        <p className="mb-3 text-sm text-zinc-600">{t.cluster.draftSectionLead}</p>
        <Link
          href={`/draft/${cluster.draftId}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          {t.cluster.openDraft}
        </Link>
      </section>
    </article>
  );
}
