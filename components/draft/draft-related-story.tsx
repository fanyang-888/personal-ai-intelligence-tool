"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

type DraftRelatedStoryProps = {
  clusterId: string;
  clusterTitle: string;
  clusterSummaryExcerpt: string;
  clusterExists: boolean;
};

export function DraftRelatedStory({
  clusterId,
  clusterTitle,
  clusterSummaryExcerpt,
  clusterExists,
}: DraftRelatedStoryProps) {
  const { t } = useI18n();
  const href = `/cluster/${clusterId}`;

  return (
    <section className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50/60 p-5 sm:p-6">
      <SectionTitle>{t.draft.relatedStorySection}</SectionTitle>
      <h3 className="mt-1 text-base font-semibold text-foreground">
        <Link
          href={href}
          className="text-emerald-900 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {clusterTitle}
        </Link>
      </h3>
      {clusterSummaryExcerpt ? (
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          {clusterSummaryExcerpt}
        </p>
      ) : null}
      {!clusterExists ? (
        <p className="mt-3 text-sm text-zinc-600">{t.draft.clusterNotInCatalog}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        <Link
          href={href}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {t.draft.viewSourceStory}
        </Link>
        <Link
          href={href}
          className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-foreground"
        >
          {t.draft.backToStory}
        </Link>
      </div>
    </section>
  );
}
