import Link from "next/link";
import { Badge } from "@/components/shared/badge";
import type { Cluster } from "@/types/cluster";

type ClusterCardProps = {
  cluster: Cluster;
};

export function ClusterCard({ cluster }: ClusterCardProps) {
  return (
    <li className="rounded border border-zinc-200 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{cluster.theme}</Badge>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-foreground">{cluster.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{cluster.summary}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link href={`/cluster/${cluster.id}`} className="text-xs font-medium underline">
          View story
        </Link>
        <Link href={`/draft/${cluster.draftId}`} className="text-xs font-medium underline">
          Open draft
        </Link>
      </div>
    </li>
  );
}
