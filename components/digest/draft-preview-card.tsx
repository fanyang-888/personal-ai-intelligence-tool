import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import type { Draft } from "@/types/draft";

type DraftPreviewCardProps = {
  draft: Draft;
};

export function DraftPreviewCard({ draft }: DraftPreviewCardProps) {
  const preview =
    draft.body.length > 200 ? `${draft.body.slice(0, 200).trim()}…` : draft.body;

  return (
    <section className="mb-8 rounded border border-zinc-200 p-4">
      <SectionTitle>Draft of the day</SectionTitle>
      <h3 className="text-base font-semibold text-foreground">{draft.title}</h3>
      {draft.topic ? <p className="mt-1 text-sm text-zinc-600">{draft.topic}</p> : null}
      <p className="mt-3 text-sm leading-relaxed text-foreground">{preview}</p>
      <Link
        href={`/draft/${draft.id}`}
        className="mt-4 inline-block text-sm font-medium underline"
      >
        Open draft
      </Link>
    </section>
  );
}
