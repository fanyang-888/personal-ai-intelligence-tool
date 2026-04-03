import Link from "next/link";
import { buildDigestView } from "@/lib/mappers/digest";
import { getClusterById } from "@/lib/mock-data/clusters";
import { formatDigestDate } from "@/lib/utils/format-date";
import { FeaturedStoryCard } from "@/components/digest/featured-story-card";
import { ClusterCard } from "@/components/digest/cluster-card";
import { DraftPreviewCard } from "@/components/digest/draft-preview-card";
import { DiscoverArchiveCta } from "@/components/digest/quick-archive-entry";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";

export default function HomePage() {
  const { featured, topClusters, draftOfDay } = buildDigestView();
  const dateLabel = formatDigestDate();
  const relatedStoryTitle = draftOfDay
    ? getClusterById(draftOfDay.clusterId)?.title
    : undefined;

  return (
    <div>
      <header className="mb-10 border-b border-zinc-100 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          Daily AI Digest
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
          Top ranked AI updates with cross-source synthesis and practical context
        </p>
        <p className="mt-3 text-sm font-medium text-zinc-500">{dateLabel}</p>
      </header>

      <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_min(18rem,34%)] lg:items-start">
        <div className="min-w-0">
          {featured ? (
            <FeaturedStoryCard cluster={featured} />
          ) : (
            <EmptyState
              title="No featured story"
              description="Add a featured cluster in mock data."
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
              title="No draft of the day"
              description="Mock digest has no draft entry."
            />
          )}
        </div>
      </div>

      <section className="mb-12">
        <SectionTitle>Top Story Clusters</SectionTitle>
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
                View all daily insights
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="Waiting for more data"
            description="We need a bit more signal to synthesize today's clusters. Check back soon or browse the archive."
            action={
              <Link
                href="/archive"
                className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4"
              >
                Go to Archive
              </Link>
            }
          />
        )}
      </section>

      <DiscoverArchiveCta />
    </div>
  );
}
