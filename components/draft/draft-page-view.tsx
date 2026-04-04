"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { DraftHeader } from "@/components/draft/draft-header";
import { DraftActions } from "@/components/draft/draft-actions";
import { SectionTitle } from "@/components/shared/section-title";
import type { Draft } from "@/types/draft";

type DraftPageViewProps = {
  draft: Draft;
  clusterTitle: string;
  bodies: string[];
  clusterId: string | null;
};

export function DraftPageView({
  draft,
  clusterTitle,
  bodies,
  clusterId,
}: DraftPageViewProps) {
  const { t } = useI18n();

  return (
    <article>
      <DraftHeader draft={draft} clusterTitle={clusterTitle} />

      <DraftActions bodies={bodies} />

      <section className="mb-6">
        <SectionTitle>{t.draft.takeaways}</SectionTitle>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
          {draft.takeaways.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <SectionTitle>{t.draft.careerInterpretation}</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground">{draft.careerInterpretation}</p>
      </section>

      <section className="rounded border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
        <p className="font-medium text-foreground">{t.draft.notesTitle}</p>
        <p className="mt-2">{t.draft.notesBody}</p>
        {clusterId ? (
          <p className="mt-3">
            <Link href={`/cluster/${clusterId}`} className="font-medium underline">
              {t.draft.backToCluster}
            </Link>
          </p>
        ) : null}
      </section>
    </article>
  );
}
