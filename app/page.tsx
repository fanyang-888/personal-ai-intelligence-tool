import Link from "next/link";
import { buildDigestView } from "@/lib/mappers/digest";
import { formatDigestDate } from "@/lib/utils/format-date";
import { FeaturedStoryCard } from "@/components/digest/featured-story-card";
import { ClusterCard } from "@/components/digest/cluster-card";
import { DraftPreviewCard } from "@/components/digest/draft-preview-card";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";

export default function HomePage() {
  const { featured, topClusters, draftOfDay } = buildDigestView();
  const dateLabel = formatDigestDate();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Daily Digest
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Curated story clusters and a draft you can share or refine.
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{dateLabel}</p>
      </header>

      {featured ? (
        <FeaturedStoryCard cluster={featured} />
      ) : (
        <EmptyState title="No featured story" description="Add a featured cluster in mock data." />
      )}

      <section className="mb-8">
        <SectionTitle>Top story clusters</SectionTitle>
        {topClusters.length > 0 ? (
          <ul className="space-y-3">
            {topClusters.map((c) => (
              <ClusterCard key={c.id} cluster={c} />
            ))}
          </ul>
        ) : (
          <EmptyState title="No clusters yet" />
        )}
      </section>

      {draftOfDay ? (
        <DraftPreviewCard draft={draftOfDay} />
      ) : (
        <EmptyState title="No draft of the day" />
      )}

      <section className="rounded border border-zinc-200 p-4">
        <SectionTitle>Archive</SectionTitle>
        <p className="mb-3 text-sm text-zinc-600">
          Search past clusters by keyword, theme, or source.
        </p>
        <Link
          href="/archive"
          className="inline-block text-sm font-medium underline underline-offset-4"
        >
          Go to Archive
        </Link>
      </section>
    </div>
  );
}
