import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import type { Cluster } from "@/types/cluster";

type RelatedStoriesProps = {
  clusters: Cluster[];
};

export function RelatedStories({ clusters }: RelatedStoriesProps) {
  if (clusters.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionTitle>Related stories</SectionTitle>
      <ul className="space-y-2 text-sm">
        {clusters.map((c) => (
          <li key={c.id}>
            <Link href={`/cluster/${c.id}`} className="font-medium underline underline-offset-4">
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
