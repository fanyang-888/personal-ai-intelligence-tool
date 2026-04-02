"use client";

import { useCallback, useState } from "react";
import { DraftBody } from "@/components/draft/draft-body";

type DraftActionsProps = {
  bodies: string[];
  copyLabel?: string;
};

export function DraftActions({ bodies, copyLabel = "Copy" }: DraftActionsProps) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const text = bodies[index % bodies.length] ?? "";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const handleRegenerate = useCallback(() => {
    if (bodies.length <= 1) return;
    setIndex((i) => (i + 1) % bodies.length);
    setCopied(false);
  }, [bodies.length]);

  return (
    <div className="mb-6">
      <DraftBody text={text} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded border border-zinc-300 bg-background px-3 py-1.5 text-sm font-medium"
        >
          {copied ? "Copied" : copyLabel}
        </button>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={bodies.length <= 1}
          className="rounded border border-zinc-300 bg-background px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          Regenerate
        </button>
        {bodies.length > 1 ? (
          <span className="text-xs text-zinc-500">
            Variant {(index % bodies.length) + 1} of {bodies.length} (local mock)
          </span>
        ) : null}
      </div>
    </div>
  );
}
