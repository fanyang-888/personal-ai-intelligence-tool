import Link from "next/link";
import { Badge } from "@/components/shared/badge";
import { SectionTitle } from "@/components/shared/section-title";
import type { Cluster } from "@/types/cluster";

type FeaturedStoryCardProps = {
  cluster: Cluster;
};

export function FeaturedStoryCard({ cluster }: FeaturedStoryCardProps) {
  return (
    <section className="mb-8 rounded border border-zinc-200 p-4">
      <SectionTitle>Featured story</SectionTitle>
      <Badge>{cluster.theme}</Badge>
      <h3 className="mt-2 text-base font-semibold text-foreground">{cluster.title}</h3>
      {cluster.subtitle ? (
        <p className="mt-1 text-sm text-zinc-600">{cluster.subtitle}</p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-foreground">{cluster.summary}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/cluster/${cluster.id}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          View story
        </Link>
        <Link
          href={`/draft/${cluster.draftId}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          Open draft
        </Link>
      </div>
    </section>
  );
}
