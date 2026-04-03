import Link from "next/link";
import { StoryBadge } from "@/components/digest/story-badge";
import type { Cluster } from "@/types/cluster";

type FeaturedStoryCardProps = {
  cluster: Cluster;
};

export function FeaturedStoryCard({ cluster }: FeaturedStoryCardProps) {
  const sourceCount = cluster.sourceIds.length;
  const score = cluster.clusterScore ?? "—";
  const status = cluster.storyStatus ?? "Featured";

  return (
    <section
      className="mb-12 rounded-lg border border-zinc-200 border-l-4 border-l-emerald-600 bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby="featured-story-title"
    >
      <h2
        id="featured-story-title"
        className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.65rem]"
      >
        {cluster.title}
      </h2>
      {cluster.subtitle ? (
        <p className="mt-2 text-sm text-zinc-500">{cluster.subtitle}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <StoryBadge variant="status">{status}</StoryBadge>
        <StoryBadge variant="metric">
          {sourceCount} source{sourceCount === 1 ? "" : "s"}
        </StoryBadge>
        <StoryBadge variant="metric">Score {score}</StoryBadge>
      </div>

      <p className="mt-5 text-base leading-relaxed text-foreground">{cluster.summary}</p>

      <p className="mt-4 text-sm font-medium text-zinc-600">
        <span className="text-zinc-500">Why it matters: </span>
        {cluster.whyItMatters}
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/cluster/${cluster.id}`}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          View Story
        </Link>
        <Link
          href={`/draft/${cluster.draftId}`}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          Open Draft
        </Link>
      </div>
    </section>
  );
}
