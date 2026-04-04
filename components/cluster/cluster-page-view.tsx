"use client";

import { useI18n } from "@/lib/i18n";
import { ClusterBreadcrumbs } from "@/components/cluster/cluster-breadcrumbs";
import { ClusterHeader } from "@/components/cluster/cluster-header";
import { TakeawayList } from "@/components/cluster/takeaway-list";
import { WhyItMattersSection } from "@/components/cluster/why-it-matters-section";
import { CoveredSourcesList } from "@/components/cluster/covered-sources-list";
import { RelatedStories } from "@/components/cluster/related-stories";
import { DraftAction } from "@/components/cluster/draft-action";
import { ClusterStoryFooter } from "@/components/cluster/cluster-story-footer";
import { SectionTitle } from "@/components/shared/section-title";
import { getNextClusterInRankOrder } from "@/lib/utils/cluster-meta";
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
  const nextCluster = getNextClusterInRankOrder(cluster.id);

  return (
    <article>
      <ClusterBreadcrumbs clusterTitle={cluster.title} />
      <DraftAction draftId={cluster.draftId} variant="prominent" className="mb-6" />

      <div className="lg:grid lg:grid-cols-[1fr_min(17rem,34%)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <ClusterHeader cluster={cluster} articles={articles} />

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
          <WhyItMattersSection
            overview={cluster.whyItMatters}
            audience={cluster.audience}
          />
          <CoveredSourcesList articles={articles} />
          <RelatedStories clusters={related} />
          <ClusterStoryFooter nextCluster={nextCluster} />
        </div>

        {cluster.draftId ? (
          <aside className="mt-8 hidden min-w-0 lg:mt-0 lg:block">
            <div className="lg:sticky lg:top-24">
              <DraftAction draftId={cluster.draftId} variant="compact" />
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
