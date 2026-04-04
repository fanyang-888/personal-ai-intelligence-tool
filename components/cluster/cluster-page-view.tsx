"use client";

import { useI18n } from "@/lib/i18n";
import { ClusterHeader } from "@/components/cluster/cluster-header";
import { TakeawayList } from "@/components/cluster/takeaway-list";
import { WhyItMattersBlock } from "@/components/cluster/why-it-matters-block";
import { AudienceBlocksSection } from "@/components/cluster/audience-blocks";
import { CoveredSourcesList } from "@/components/cluster/covered-sources-list";
import { RelatedStories } from "@/components/cluster/related-stories";
import { DraftAction } from "@/components/cluster/draft-action";
import { SectionTitle } from "@/components/shared/section-title";
import type { Cluster } from "@/types/cluster";
import type { Article } from "@/types/article";

type ClusterPageViewProps = {
  cluster: Cluster;
  articles: Article[];
  related: Cluster[];
};

export function ClusterPageView({
  cluster,
  articles,
  related,
}: ClusterPageViewProps) {
  const { t } = useI18n();
  const summaryParagraphs = cluster.summary
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

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
        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          {summaryParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <TakeawayList items={cluster.takeaways} />
      <WhyItMattersBlock text={cluster.whyItMatters} />
      <AudienceBlocksSection audience={cluster.audience} />
      <CoveredSourcesList articles={articles} />
      <RelatedStories clusters={related} />
      <DraftAction draftId={cluster.draftId} />
    </article>
  );
}
