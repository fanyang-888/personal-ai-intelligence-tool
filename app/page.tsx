"use client";

import { useEffect, useState } from "react";
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
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { MobileClusterRow } from "@/components/digest/mobile-cluster-row";
import { RoleSelectorBanner } from "@/components/digest/role-selector-banner";
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

      {/* ── Mobile layout (< sm) ── */}
      <div className="sm:hidden">
        <RoleSelectorBanner />
        {/* Featured story */}
        {featured ? (
          <div
            className="mb-4 rounded-xl border border-l-4 p-4"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              borderLeftColor: "var(--accent)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                style={{
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  background: "var(--accent-faint)",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {featured.storyStatus ?? "new"}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {featured.articleIds.length} source{featured.articleIds.length !== 1 ? "s" : ""}
              </span>
            </div>
            <h2
              className="mb-2 leading-snug font-bold"
              style={{ fontSize: 17, color: "var(--text)", letterSpacing: "-0.2px" }}
            >
              {pickLocalized(featured.title, lang)}
            </h2>
            <p
              className="mb-3 line-clamp-3 leading-relaxed"
              style={{ fontSize: 13, color: "var(--text-muted)" }}
            >
              {pickLocalized(featured.summary, lang)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {(featured.tags ?? []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded px-2 py-0.5"
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/cluster/${featured.id}`}
                className="font-semibold"
                style={{ fontSize: 12, color: "var(--accent)" }}
              >
                {t.digest.viewStory} →
              </Link>
            </div>
          </div>
        ) : null}

        {/* Draft banner */}
        {draftOfDay ? (
          <Link
            href={`/draft/${draftOfDay.id}`}
            className="mb-4 flex items-center gap-3 rounded-xl border border-l-[3px] p-3 no-underline"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              borderLeftColor: "var(--text-dim)",
              display: "flex",
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="mb-1"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {t.nav.draftOfDay}
              </p>
              <p
                className="truncate font-semibold leading-snug"
                style={{ fontSize: 13, color: "var(--text)" }}
              >
                {pickLocalized(draftOfDay.title, lang)}
              </p>
            </div>
            <span style={{ color: "var(--text-dim)", fontSize: 18, flexShrink: 0, lineHeight: 1 }}>›</span>
          </Link>
        ) : null}

        {/* More stories label */}
        {topClusters.length > 1 ? (
          <>
            <p
              className="mb-1 flex items-center justify-between"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
              }}
            >
              <span>{t.home.topClusters}</span>
              <Link href="/archive" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.05em", textTransform: "none" }}>
                {t.home.viewAllInsights} →
              </Link>
            </p>
            <div>
              {topClusters.filter((c) => c.id !== featured?.id).map((c) => (
                <MobileClusterRow key={c.id} cluster={c} />
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-6">
          <SubscribeBar />
        </div>
      </div>

      {/* ── Desktop layout (sm+) ── */}
      <div className="hidden sm:block">
        <RoleSelectorBanner />
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
              <ul className="space-y-4">
                {topClusters.map((c) => (
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
      </div>{/* end hidden sm:block */}
    </div>
  );
}
