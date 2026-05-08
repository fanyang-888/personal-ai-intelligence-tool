"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDigestDate } from "@/lib/utils/format-date";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { uiTextLinkPrimary } from "@/lib/ui/classes";
import { FeaturedStoryCard } from "@/components/digest/featured-story-card";
import { ClusterCard } from "@/components/digest/cluster-card";
import { DraftPreviewCard } from "@/components/digest/draft-preview-card";
import { DiscoverArchiveCta } from "@/components/digest/quick-archive-entry";
import { AIBasicCard } from "@/components/digest/ai-basic-card";
import { SubscribeBar } from "@/components/shared/subscribe-bar";
import { SippyHero } from "@/components/layout/sipply-hero";
import { SectionBlock } from "@/components/shared/section-block";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { TopicFilter } from "@/components/shared/topic-filter";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { fetchTodayDigest, fetchTodayDraft } from "@/lib/api";
import { apiClusterToCluster, apiDraftToDraft } from "@/lib/api/mappers";
import type { Cluster } from "@/types/cluster";
import type { Draft } from "@/types/draft";

export default function HomePage() {
  const { t, lang } = useI18n();
  const dateLabel = formatDigestDate(new Date(), lang);

  const [featured, setFeatured] = useState<Cluster | null>(null);
  const [topClusters, setTopClusters] = useState<Cluster[]>([]);
  const [draftOfDay, setDraftOfDay] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [digest, draft] = await Promise.all([
          fetchTodayDigest(),
          fetchTodayDraft().catch(() => null),
        ]);

        if (cancelled) return;

        setFeatured(digest.featured ? apiClusterToCluster(digest.featured) : null);
        setTopClusters(digest.topClusters.map(apiClusterToCluster));
        setDraftOfDay(draft ? apiDraftToDraft(draft) : null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message ?? "Failed to load digest");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const relatedStoryTitle = draftOfDay && featured
    ? pickLocalized(featured.title, lang)
    : undefined;

  const allTags = useMemo(() => {
    const seen = new Set<string>();
    topClusters.forEach(c => (c.tags || []).forEach(t => seen.add(t)));
    return [...seen];
  }, [topClusters]);

  const filteredClusters = topicFilter.length > 0
    ? topClusters.filter(c => (c.tags || []).some(t => topicFilter.includes(t)))
    : topClusters;

  if (loading) {
    return <LoadingState layout="digest" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load today's digest"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      <SippyHero dateLabel={dateLabel} />

      <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_min(18rem,34%)] lg:items-start">
        <div className="min-w-0">
          {featured ? (
            <FeaturedStoryCard cluster={featured} />
          ) : (
            <EmptyState
              title={t.home.emptyFeaturedTitle}
              description={t.home.emptyFeaturedDesc}
            />
          )}
        </div>
        <div className="min-w-0">
          {draftOfDay ? (
            <DraftPreviewCard
              draft={draftOfDay}
              relatedStoryTitle={relatedStoryTitle}
              variant="aside"
            />
          ) : (
            <div id="draft-of-the-day" className="scroll-mt-24">
              <EmptyState
                title={t.home.emptyDraftTitle}
                description={t.home.emptyDraftDesc}
              />
            </div>
          )}
        </div>
      </div>

      <SectionBlock>
        <SectionTitle>{t.home.topClusters}</SectionTitle>
        {topClusters.length > 0 ? (
          <>
            <TopicFilter tags={allTags} onChange={setTopicFilter} />
            <ul className="space-y-4">
              {filteredClusters.map((c) => (
                <ClusterCard key={c.id} cluster={c} />
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/archive" className={uiTextLinkPrimary}>
                {t.home.viewAllInsights}
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title={t.home.emptyClustersTitle}
            description={t.home.emptyClustersDesc}
            action={
              <Link href="/archive" className={uiTextLinkPrimary}>
                {t.home.goToArchive}
              </Link>
            }
          />
        )}
      </SectionBlock>

      <SectionBlock>
        <AIBasicCard />
      </SectionBlock>

      <SectionBlock>
        <SubscribeBar />
      </SectionBlock>

      <DiscoverArchiveCta />
    </div>
  );
}
