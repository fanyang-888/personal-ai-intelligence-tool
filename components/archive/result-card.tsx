"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { ArchiveResultRow } from "@/lib/mappers/archive";
import { Badge } from "@/components/shared/badge";

type ResultCardProps = {
  row: ArchiveResultRow;
};

export function ResultCard({ row }: ResultCardProps) {
  const { t } = useI18n();

  return (
    <li className="rounded-lg border border-zinc-300/90 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{row.themeLabel}</Badge>
        </div>
        {row.freshnessLabel ? (
          <span className="shrink-0 text-xs text-zinc-500">{row.freshnessLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
        <Link href={`/cluster/${row.id}`} className="underline-offset-4 hover:underline">
          {row.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{row.summarySnippet}</p>
      <p className="mt-3 text-xs text-zinc-500">
        <span className="font-medium text-zinc-600">{t.digest.sourcesPrefix} </span>
        {row.sourceLabels}
      </p>
    </li>
  );
}
