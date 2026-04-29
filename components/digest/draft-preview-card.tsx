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
    <>
      {/* Mobile: horizontal strip */}
      <Link
        href={`/draft/${draft.id}`}
        id="draft-of-the-day"
        className="sm:hidden scroll-mt-24 flex items-center gap-3 rounded-2xl px-4 py-3 mb-2"
        style={{
          background: "linear-gradient(135deg, #0f3352 0%, #1a5280 100%)",
          border: "1px solid #2a6a96",
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "#163f5c", border: "1px solid #2a6a96" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#5dc8f5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a9bbf", marginBottom: "2px" }}>
            {t.draftPreview.sectionTitle}
          </p>
          <p className="truncate text-sm font-medium" style={{ color: "#d4edf8" }}>
            {pickLocalized(draft.title, lang)}
          </p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="#5dc8f5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} className="shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>

      {/* Desktop: full card */}
      <ResultCardFrame
        as="section"
        variant="digestMuted"
        id={isAside ? undefined : "draft-of-the-day"}
        aria-labelledby="draft-of-day-heading"
        className={`hidden sm:block scroll-mt-24 ${
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
        <p className={`mt-3 text-sm leading-relaxed text-zinc-700 ${clamp}`}>
          {preview}
        </p>
        <Link
          href={`/draft/${draft.id}`}
          className={`mt-5 inline-block ${uiTextLinkPrimary}`}
        >
          {t.draftPreview.openFullDraft}
        </Link>
      </ResultCardFrame>
    </>
  );
}
