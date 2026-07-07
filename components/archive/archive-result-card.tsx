"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { ArchiveResultRow } from "@/lib/mappers/archive";
import { Badge } from "@/components/shared/badge";
import { HighlightMatch } from "@/components/archive/highlight-match";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { uiMetaText } from "@/lib/ui/classes";

type ArchiveResultCardProps = {
  row: ArchiveResultRow;
  highlightQuery?: string;
};

export function ArchiveResultCard({ row, highlightQuery }: ArchiveResultCardProps) {
  const { t } = useI18n();

  return (
    <ResultCardFrame as="li" variant="archiveCluster">
      <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{row.themeLabel}</Badge>
        </div>
        {row.freshnessLabel ? (
          <span className={`shrink-0 ${uiMetaText}`}>{row.freshnessLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
        <Link href={`/cluster/${row.id}`} className="underline-offset-4 hover:underline">
          {row.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed [color:var(--text-muted)]">
        <HighlightMatch text={row.summarySnippet} query={highlightQuery ?? ""} />
      </p>
      <p className={`mt-3 ${uiMetaText}`}>
        <span className="font-medium [color:var(--text-muted)]">{t.digest.sourcesPrefix} </span>
        {row.sourceLabels}
      </p>
    </ResultCardFrame>
  );
}
