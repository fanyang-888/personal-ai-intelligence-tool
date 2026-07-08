"use client";

import Link from "next/link";
import type { ArchiveClusterRow } from "@/lib/mappers/archive";
import { HighlightMatch } from "@/components/archive/highlight-match";

type ArchiveTimelineRowProps = {
  row: ArchiveClusterRow;
  highlightQuery?: string;
};

/** Compact timeline row: category · title + one-line summary · sources/freshness/score. */
export function ArchiveTimelineRow({ row, highlightQuery }: ArchiveTimelineRowProps) {
  const score = Math.min(100, Math.max(0, Math.round(row.clusterScore ?? 0)));

  return (
    <Link
      href={`/cluster/${row.id}`}
      className="mb-2 flex flex-col gap-1.5 rounded-[10px] border p-3.5 no-underline transition-[border-color,transform] duration-150 hover:translate-x-[3px] [background:var(--surface)] [border-color:var(--border)] hover:[border-color:var(--accent)] sm:flex-row sm:items-start sm:gap-3.5 sm:px-4"
    >
      <span
        className="shrink-0 text-[9px] font-medium uppercase tracking-[0.1em] [color:var(--accent)] sm:w-[92px] sm:pt-[3px]"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {row.themeLabel}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold leading-snug text-foreground">
          <HighlightMatch text={row.title} query={highlightQuery ?? ""} />
        </span>
        <span className="mt-0.5 block truncate text-xs [color:var(--text-muted)]">
          <HighlightMatch text={row.summarySnippet} query={highlightQuery ?? ""} />
        </span>
      </span>
      <span className="shrink-0 text-[10.5px] leading-relaxed [color:var(--text-dim)] sm:w-[140px] sm:text-right">
        <span className="block truncate">{row.sourceLabels}</span>
        <span className="flex flex-wrap items-center gap-x-1.5 sm:justify-end">
          {row.freshnessLabel ? (
            <span className="whitespace-nowrap">{row.freshnessLabel}</span>
          ) : null}
          {row.clusterScore != null ? (
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span>· {score}%</span>
              <span className="inline-block h-[3px] w-[34px] overflow-hidden rounded-full [background:var(--border)]">
                <span
                  className="block h-full rounded-full [background:var(--accent)]"
                  style={{ width: `${score}%` }}
                />
              </span>
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}
