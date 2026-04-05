"use client";

import Link from "next/link";
import { buildDigestView } from "@/lib/mappers/digest";
import { getClusterById } from "@/lib/mock-data/clusters";
import { formatDigestDate } from "@/lib/utils/format-date";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { FeaturedStoryCard } from "@/components/digest/featured-story-card";
import { ClusterCard } from "@/components/digest/cluster-card";
import { DraftPreviewCard } from "@/components/digest/draft-preview-card";
import { DiscoverArchiveCta } from "@/components/digest/quick-archive-entry";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";

export default function HomePage() {
  const { t, lang } = useI18n();
  const { featured, topClusters, draftOfDay } = buildDigestView();
  const dateLabel = formatDigestDate(new Date(), lang);
  const relatedCluster = draftOfDay
    ? getClusterById(draftOfDay.clusterId)
    : undefined;
  const relatedStoryTitle = relatedCluster
    ? pickLocalized(relatedCluster.title, lang)
    : undefined;

  return (
    <div>
      <header className="mb-10 border-b border-zinc-100 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {t.home.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
          {t.home.subtitle}
        </p>
        <p className="mt-3 text-sm font-medium text-zinc-500">{dateLabel}</p>
      </header>

      <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_min(18rem,34%)] lg:items-start">
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
            <EmptyState
              title={t.home.emptyDraftTitle}
              description={t.home.emptyDraftDesc}
            />
          )}
        </div>
      </div>

      <section className="mb-12">
        <SectionTitle>{t.home.topClusters}</SectionTitle>
        {topClusters.length > 0 ? (
          <>
            <ul className="space-y-4">
              {topClusters.map((c) => (
                <ClusterCard key={c.id} cluster={c} />
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/archive"
                className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
              >
                {t.home.viewAllInsights}
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title={t.home.emptyClustersTitle}
            description={t.home.emptyClustersDesc}
            action={
              <Link
                href="/archive"
                className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4"
              >
                {t.home.goToArchive}
              </Link>
            }
          />
        )}
      </section>

      <DiscoverArchiveCta />
    </div>
  );
}
