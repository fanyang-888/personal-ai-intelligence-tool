"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/api/track";
import { ActionRow } from "@/components/shared/action-row";
import {
  uiTextLinkMuted,
  uiButtonGhostLink,
  uiButtonSecondary,
} from "@/lib/ui/classes";

const DRAFT_CHAR_SOFT_LIMIT = 3000;

type DraftActionsProps = {
  fullText: string;
  characterCount: number;
  clusterId: string;
  draftId: string;
  variantIndex: number;
  variantTotal: number;
  onRegenerate: () => void;
  showRegenerateNoop: boolean;
  tweetText?: string;
};

export function DraftActions({
  fullText,
  characterCount,
  clusterId,
  draftId,
  variantIndex,
  variantTotal,
  onRegenerate,
  showRegenerateNoop,
  tweetText,
}: DraftActionsProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const xShareUrl = tweetText
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}`
    : `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`;

  const handleCopy = useCallback(async () => {
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      trackEvent("draft_copied", draftId);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 3200);
    }
  }, [fullText, draftId]);

  const variant = (variantIndex % variantTotal) + 1;
  const overLimit = characterCount > DRAFT_CHAR_SOFT_LIMIT;

  return (
    <div className="mt-8 border-t pt-6 [border-color:var(--border)]">
      <ActionRow>
        <button
          type="button"
          onClick={handleCopy}
          className={uiButtonSecondary}
        >
          {copied ? t.draft.copied : t.draft.copyDraft}
        </button>
        <a
          href={linkedInShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={uiButtonSecondary}
          onClick={() => trackEvent("draft_shared_linkedin", draftId)}
        >
          {t.draft.shareOnLinkedIn}
        </a>
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={uiButtonSecondary}
          onClick={() => trackEvent("draft_shared_x", draftId)}
        >
          {t.draft.shareOnX}
        </a>
        <button
          type="button"
          onClick={onRegenerate}
          className={uiButtonSecondary}
        >
          {t.draft.regenerate}
        </button>
        <Link href="/archive" className={uiTextLinkMuted}>
          {t.nav.archive}
        </Link>
        <Link
          href={`/cluster/${clusterId}`}
          className={uiButtonGhostLink}
        >
          {t.draft.backToStory}
        </Link>
        <span
          className={`text-sm tabular-nums ${overLimit ? "font-medium text-red-600" : "[color:var(--text-muted)]"}`}
          title={
            overLimit ? t.draft.characterCountOverSoftLimit : undefined
          }
          role="status"
        >
          {t.draft.formatDraftCharacterCount(
            characterCount,
            DRAFT_CHAR_SOFT_LIMIT,
          )}
        </span>
      </ActionRow>
      {variantTotal > 1 ? (
        <p className="mt-2 text-xs [color:var(--text-muted)]">
          {t.draft.formatVariantHint(variant, variantTotal)}
        </p>
      ) : null}
      {showRegenerateNoop ? (
        <p className="mt-2 text-xs [color:var(--text-muted)]" role="status">
          {t.draft.regenerateNoVariants}
        </p>
      ) : null}
      {copyFailed ? (
        <p className="mt-2 text-xs text-amber-800" role="alert">
          {t.draft.copyUnavailable}
        </p>
      ) : null}
    </div>
  );
}
