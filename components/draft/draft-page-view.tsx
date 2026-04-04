"use client";

import { useCallback, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { DraftHeader } from "@/components/draft/draft-header";
import { DraftRelatedStory } from "@/components/draft/draft-related-story";
import { LinkedInDraftBody } from "@/components/draft/linkedin-draft-body";
import { DraftActions } from "@/components/draft/draft-actions";
import {
  buildFullDraftText,
  getDraftContentSlices,
} from "@/lib/utils/format-linkedin-draft";
import type { Draft } from "@/types/draft";

type DraftPageViewProps = {
  draft: Draft;
  isDraftOfDay: boolean;
  clusterId: string;
  clusterTitle: string;
  clusterExists: boolean;
  clusterSummaryExcerpt: string;
  clusterTags: string[];
};

export function DraftPageView({
  draft,
  isDraftOfDay,
  clusterId,
  clusterTitle,
  clusterExists,
  clusterSummaryExcerpt,
  clusterTags,
}: DraftPageViewProps) {
  const { t } = useI18n();
  const [variantIndex, setVariantIndex] = useState(0);
  const [showRegenerateNoop, setShowRegenerateNoop] = useState(false);

  const slices = useMemo(() => getDraftContentSlices(draft), [draft]);
  const activeContent = slices[variantIndex % slices.length]!;
  const fullText = useMemo(
    () => buildFullDraftText(activeContent),
    [activeContent],
  );

  const handleRegenerate = useCallback(() => {
    if (slices.length <= 1) {
      setShowRegenerateNoop(true);
      window.setTimeout(() => setShowRegenerateNoop(false), 2200);
      return;
    }
    setVariantIndex((i) => (i + 1) % slices.length);
    setShowRegenerateNoop(false);
  }, [slices.length]);

  return (
    <article>
      <DraftHeader
        draft={draft}
        isDraftOfDay={isDraftOfDay}
        storyTitle={clusterTitle}
      />

      <DraftRelatedStory
        clusterId={clusterId}
        clusterTitle={clusterTitle}
        clusterSummaryExcerpt={clusterSummaryExcerpt}
        clusterExists={clusterExists}
        clusterTags={clusterTags}
      />

      <LinkedInDraftBody content={activeContent} />

      <DraftActions
        fullText={fullText}
        clusterId={clusterId}
        variantIndex={variantIndex}
        variantTotal={slices.length}
        onRegenerate={handleRegenerate}
        showRegenerateNoop={showRegenerateNoop}
      />

      <aside className="mt-10 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-700">
        <p className="font-medium text-foreground">{t.draft.notesTitle}</p>
        <p className="mt-2 leading-relaxed">{t.draft.notesBody}</p>
      </aside>
    </article>
  );
}
