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

function ClusterArchiveCard({
  row,
  highlightQuery,
}: {
  row: Extract<ArchiveResultRow, { kind: "cluster" }>;
  highlightQuery?: string;
}) {
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
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        <HighlightMatch text={row.summarySnippet} query={highlightQuery ?? ""} />
      </p>
      <p className={`mt-3 ${uiMetaText}`}>
        <span className="font-medium text-zinc-600">{t.digest.sourcesPrefix} </span>
        {row.sourceLabels}
      </p>
    </ResultCardFrame>
  );
}

function ArticleArchiveCard({
  row,
  highlightQuery,
}: {
  row: Extract<ArchiveResultRow, { kind: "article" }>;
  highlightQuery?: string;
}) {
  const { t } = useI18n();

  return (
    <ResultCardFrame as="li" variant="archiveArticle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
          {row.sourceName}
        </span>
        {row.publishedLabel ? (
          <span className={uiMetaText}>
            {t.archive.publishedLabel} · {row.publishedLabel}
          </span>
        ) : null}
      </div>
      <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          {row.title}
        </a>
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
        <HighlightMatch text={row.excerptSnippet} query={highlightQuery ?? ""} />
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <Badge>{row.themeLabel}</Badge>
        <span className="text-zinc-400">·</span>
        <Link
          href={`/cluster/${row.clusterId}`}
          className="text-zinc-600 underline-offset-2 hover:text-foreground hover:underline"
        >
          {t.archive.relatedCluster}: {row.clusterTitle}
        </Link>
      </div>
    </ResultCardFrame>
  );
}

export function ArchiveResultCard({ row, highlightQuery }: ArchiveResultCardProps) {
  if (row.kind === "cluster") {
    return <ClusterArchiveCard row={row} highlightQuery={highlightQuery} />;
  }
  return <ArticleArchiveCard row={row} highlightQuery={highlightQuery} />;
}
