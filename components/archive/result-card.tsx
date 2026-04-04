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
    <li className="rounded border border-zinc-200 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{row.theme}</Badge>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-foreground">
        <Link href={`/cluster/${row.id}`} className="underline-offset-4 hover:underline">
          {row.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-zinc-600">{row.summarySnippet}</p>
      <p className="mt-2 text-xs text-zinc-500">
        <span className="font-medium text-zinc-600">
          {t.digest.sourcesPrefix}{" "}
        </span>
        {row.sourceLabels}
      </p>
    </li>
  );
}
