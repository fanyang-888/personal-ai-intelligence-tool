"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import type { Cluster } from "@/types/cluster";

type RelatedStoriesProps = {
  clusters: Cluster[];
};

export function RelatedStories({ clusters }: RelatedStoriesProps) {
  const { t, lang } = useI18n();

  if (clusters.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.relatedStories}</SectionTitle>
      <ul className="space-y-2 text-sm">
        {clusters.map((c) => (
          <li key={c.id}>
            <Link href={`/cluster/${c.id}`} className="font-medium underline underline-offset-4">
              {pickLocalized(c.title, lang)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
