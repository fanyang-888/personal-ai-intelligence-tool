"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ActionRow } from "@/components/shared/action-row";
import {
  uiButtonGhostLink,
  uiButtonSecondary,
} from "@/lib/ui/classes";

const DRAFT_CHAR_SOFT_LIMIT = 3000;

type DraftActionsProps = {
  fullText: string;
  characterCount: number;
  clusterId: string;
  variantIndex: number;
  variantTotal: number;
  onRegenerate: () => void;
  showRegenerateNoop: boolean;
};

export function DraftActions({
  fullText,
  characterCount,
  clusterId,
  variantIndex,
  variantTotal,
  onRegenerate,
  showRegenerateNoop,
}: DraftActionsProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopy = useCallback(async () => {
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 3200);
    }
  }, [fullText]);

  const variant = (variantIndex % variantTotal) + 1;
  const overLimit = characterCount > DRAFT_CHAR_SOFT_LIMIT;

  return (
    <div className="mt-8 border-t border-zinc-100 pt-6">
      <ActionRow>
        <button
          type="button"
          onClick={handleCopy}
          className={uiButtonSecondary}
        >
          {copied ? t.draft.copied : t.draft.copyDraft}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className={uiButtonSecondary}
        >
          {t.draft.regenerate}
        </button>
        <Link
          href={`/cluster/${clusterId}`}
          className={uiButtonGhostLink}
        >
          {t.draft.backToStory}
        </Link>
        <span
          className={`text-sm tabular-nums ${overLimit ? "font-medium text-red-600" : "text-zinc-500"}`}
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
        <p className="mt-2 text-xs text-zinc-500">
          {t.draft.formatVariantHint(variant, variantTotal)}
        </p>
      ) : null}
      {showRegenerateNoop ? (
        <p className="mt-2 text-xs text-zinc-500" role="status">
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
