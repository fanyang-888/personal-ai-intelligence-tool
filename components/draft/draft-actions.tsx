"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useI18n } from "@/lib/i18n";

type DraftActionsProps = {
  fullText: string;
  clusterId: string;
  variantIndex: number;
  variantTotal: number;
  onRegenerate: () => void;
  showRegenerateNoop: boolean;
};

export function DraftActions({
  fullText,
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

  return (
    <div className="mt-8 border-t border-zinc-100 pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50"
        >
          {copied ? t.draft.copied : t.draft.copyDraft}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50"
        >
          {t.draft.regenerate}
        </button>
        <Link
          href={`/cluster/${clusterId}`}
          className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {t.draft.backToStory}
        </Link>
      </div>
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
