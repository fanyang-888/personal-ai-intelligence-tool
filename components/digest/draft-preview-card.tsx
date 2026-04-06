"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { uiTextLinkPrimary } from "@/lib/ui/classes";
import type { Draft } from "@/types/draft";

type DraftPreviewCardProps = {
  draft: Draft;
  relatedStoryTitle?: string;
  /** Tighter layout when shown beside featured on large screens */
  variant?: "default" | "aside";
};

export function DraftPreviewCard({
  draft,
  relatedStoryTitle,
  variant = "default",
}: DraftPreviewCardProps) {
  const { t, lang } = useI18n();
  const summaryText = pickLocalized(draft.summaryBlock, lang);
  const summaryLead = summaryText
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)[0];
  const previewLines = [pickLocalized(draft.hook, lang), summaryLead]
    .filter(Boolean)
    .join("\n\n");
  const preview =
    previewLines.length > 320
      ? `${previewLines.slice(0, 320).trim()}…`
      : previewLines;

  const isAside = variant === "aside";
  const clamp = isAside ? "line-clamp-3" : "line-clamp-4";

  return (
    <ResultCardFrame
      as="section"
      variant="digestMuted"
      id="draft-of-the-day"
      aria-labelledby="draft-of-day-heading"
      className={`scroll-mt-24 ${
        isAside ? "p-4 sm:p-5 lg:sticky lg:top-24" : "mb-10 p-5 sm:p-6"
      }`}
    >
      <SectionTitle id="draft-of-day-heading">
        {t.draftPreview.sectionTitle}
      </SectionTitle>
      {relatedStoryTitle ? (
        <p className="mt-1 text-sm text-zinc-500">
          {t.draftPreview.relatedStory}{" "}
          <span className="font-medium text-foreground">{relatedStoryTitle}</span>
        </p>
      ) : null}
      <h3
        className={`mt-3 font-semibold text-foreground ${
          isAside ? "text-base leading-snug" : "text-lg"
        }`}
      >
        {pickLocalized(draft.title, lang)}
      </h3>
      <p
        className={`mt-3 text-sm leading-relaxed text-zinc-700 ${clamp}`}
      >
        {preview}
      </p>
      <Link
        href={`/draft/${draft.id}`}
        className={`mt-5 inline-block ${uiTextLinkPrimary}`}
      >
        {t.draftPreview.openFullDraft}
      </Link>
    </ResultCardFrame>
  );
}
