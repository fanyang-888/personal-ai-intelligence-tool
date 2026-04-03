import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import type { Draft } from "@/types/draft";

type DraftPreviewCardProps = {
  draft: Draft;
  relatedStoryTitle?: string;
};

export function DraftPreviewCard({
  draft,
  relatedStoryTitle,
}: DraftPreviewCardProps) {
  const paragraphs = draft.body.split(/\n\n+/).filter(Boolean);
  const previewLines = paragraphs.slice(0, 2).join("\n\n");
  const preview =
    previewLines.length > 320
      ? `${previewLines.slice(0, 320).trim()}…`
      : previewLines;

  return (
    <section
      id="draft-of-the-day"
      className="mb-12 scroll-mt-24 rounded-lg border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6"
      aria-labelledby="draft-of-day-heading"
    >
      <SectionTitle id="draft-of-day-heading">Draft of the Day</SectionTitle>
      {relatedStoryTitle ? (
        <p className="mt-1 text-sm text-zinc-500">
          Related story:{" "}
          <span className="font-medium text-foreground">{relatedStoryTitle}</span>
        </p>
      ) : null}
      <h3 className="mt-3 text-lg font-semibold text-foreground">{draft.title}</h3>
      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-zinc-700">
        {preview}
      </p>
      <Link
        href={`/draft/${draft.id}`}
        className="mt-5 inline-block text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
      >
        Open Full Draft
      </Link>
    </section>
  );
}
