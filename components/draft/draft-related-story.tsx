"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { SectionTitle } from "@/components/shared/section-title";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { useI18n } from "@/lib/i18n";
import { firstParagraphExcerpt, pickLocalized } from "@/lib/utils/localized-string";
import { uiTextLinkMuted, uiTextLinkPrimary } from "@/lib/ui/classes";
import type { LocalizedString } from "@/types/localized";

type DraftRelatedStoryProps = {
  clusterId: string;
  clusterTitle: LocalizedString;
  clusterSummary: LocalizedString;
  clusterExists: boolean;
  clusterTags: string[];
};

export function DraftRelatedStory({
  clusterId,
  clusterTitle,
  clusterSummary,
  clusterExists,
  clusterTags,
}: DraftRelatedStoryProps) {
  const { t, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const href = `/cluster/${clusterId}`;
  const clusterSummaryExcerpt = useMemo(
    () => firstParagraphExcerpt(clusterSummary, lang),
    [clusterSummary, lang],
  );
  const canExpand = Boolean(clusterSummaryExcerpt) || !clusterExists;

  return (
    <ResultCardFrame
      as="section"
      variant="digestMuted"
      className="mb-8 p-5 sm:p-6"
    >
      <SectionTitle>{t.draft.relatedStorySection}</SectionTitle>
      <h3 className="mt-1 text-base font-semibold text-foreground">
        <Link href={href} className={uiTextLinkPrimary}>
          {pickLocalized(clusterTitle, lang)}
        </Link>
      </h3>

      {clusterTags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={t.draft.relatedStorySection}>
          {clusterTags.map((tag, i) => (
            <li key={`${i}-${tag}`}>
              <span className="inline-block rounded-full border [border-color:var(--border)] [background:var(--surface)] px-2.5 py-0.5 text-xs font-medium [color:var(--text-muted)]">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {canExpand ? (
        <div className="mt-3">
          <button
            type="button"
            className={`cursor-pointer ${uiTextLinkPrimary}`}
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? t.draft.collapseRelatedStory : t.draft.expandRelatedStory}
          </button>
        </div>
      ) : null}

      {expanded ? (
        <div id={panelId} className="mt-3">
          {clusterSummaryExcerpt ? (
            <p className="text-sm leading-relaxed [color:var(--text-muted)]">
              {clusterSummaryExcerpt}
            </p>
          ) : null}
          {!clusterExists ? (
            <p
              className={
                clusterSummaryExcerpt ? "mt-3 text-sm [color:var(--text-muted)]" : "text-sm [color:var(--text-muted)]"
              }
            >
              {t.draft.clusterNotInCatalog}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        <Link href={href} className={uiTextLinkPrimary}>
          {t.draft.viewSourceStory}
        </Link>
        <Link href={href} className={uiTextLinkMuted}>
          {t.draft.backToStory}
        </Link>
      </div>
    </ResultCardFrame>
  );
}
