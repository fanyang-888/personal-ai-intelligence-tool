import Link from "next/link";
import type { ArchiveResultRow } from "@/lib/mappers/archive";
import { Badge } from "@/components/shared/badge";

type ResultCardProps = {
  row: ArchiveResultRow;
};

export function ResultCard({ row }: ResultCardProps) {
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
      <p className="mt-2 text-xs text-zinc-500">Sources: {row.sourceLabels}</p>
    </li>
  );
}
