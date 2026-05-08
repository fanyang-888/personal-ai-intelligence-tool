"use client";

import { useCallback, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { DraftHeader } from "@/components/draft/draft-header";
import { DraftRelatedStory } from "@/components/draft/draft-related-story";
import { LinkedInDraftBody } from "@/components/draft/linkedin-draft-body";
import { DraftActions } from "@/components/draft/draft-actions";
import { BilingualTrustNote } from "@/components/shared/bilingual-assist-text";
import {
  collectHashtagLabelsFromClusterArticles,
  formatHashtagLine,
} from "@/lib/utils/draft-hashtags";
import {
  buildFullDraftText,
  getDraftContentSlices,
} from "@/lib/utils/format-linkedin-draft";
import type { Draft } from "@/types/draft";
import type { LocalizedString } from "@/types/localized";

type DraftPageViewProps = {
  draft: Draft;
  isDraftOfDay: boolean;
  clusterId: string;
  clusterTitle: LocalizedString;
  clusterExists: boolean;
  clusterSummary: LocalizedString;
  clusterTags: string[];
};

export function DraftPageView({
  draft,
  isDraftOfDay,
  clusterId,
  clusterTitle,
  clusterExists,
  clusterSummary,
  clusterTags,
}: DraftPageViewProps) {
  const { t, lang } = useI18n();
  const [variantIndex, setVariantIndex] = useState(0);
  const [showRegenerateNoop, setShowRegenerateNoop] = useState(false);

  const slices = useMemo(() => getDraftContentSlices(draft), [draft]);
  const activeContent = slices[variantIndex % slices.length]!;
  const hashtagLabels = useMemo(
    () => collectHashtagLabelsFromClusterArticles(draft.clusterId),
    [draft.clusterId],
  );
  const hashtagLine = useMemo(
    () => formatHashtagLine(hashtagLabels),
    [hashtagLabels],
  );
  const fullText = useMemo(
    () =>
      buildFullDraftText(activeContent, hashtagLabels, lang, {
        careerAngle: t.draft.sectionCareerAngle,
        whyThisMatters: t.draft.sectionWhyItMatters,
      }),
    [activeContent, hashtagLabels, lang, t],
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
        clusterSummary={clusterSummary}
        clusterExists={clusterExists}
        clusterTags={clusterTags}
      />

      {lang === "zh" ? (
        <BilingualTrustNote>{t.draft.bilingualAssistTrustNote}</BilingualTrustNote>
      ) : null}

      <LinkedInDraftBody
        content={activeContent}
        hashtagLine={hashtagLine || undefined}
      />

      <DraftActions
        fullText={fullText}
        characterCount={fullText.length}
        clusterId={clusterId}
        draftId={draft.id}
        variantIndex={variantIndex}
        variantTotal={slices.length}
        onRegenerate={handleRegenerate}
        showRegenerateNoop={showRegenerateNoop}
        tweetText={pickLocalized(activeContent.hook, lang).slice(0, 200)}
      />

      <aside className="mt-10 rounded-lg border border-dashed p-4 text-sm [border-color:var(--border)] [background:var(--surface2)] [color:var(--text)]">
        <p className="font-medium text-foreground">{t.draft.notesTitle}</p>
        <p className="mt-2 leading-relaxed">{t.draft.notesBody}</p>
      </aside>
    </article>
  );
}
