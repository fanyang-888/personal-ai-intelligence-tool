import Link from "next/link";
import { SourceChannelBadge } from "@/components/digest/source-channel-badge";
import { StoryBadge } from "@/components/digest/story-badge";
import {
  formatClusterSourcesLine,
  formatRelevancePercent,
  getClusterSourceChannelCounts,
} from "@/lib/utils/cluster-sources";
import type { Cluster } from "@/types/cluster";

type ClusterCardProps = {
  cluster: Cluster;
};

export function ClusterCard({ cluster }: ClusterCardProps) {
  const tags = cluster.tags?.length ? cluster.tags : [cluster.theme];
  const sourceCount = cluster.sourceIds.length;
  const relevance = formatRelevancePercent(cluster.clusterScore);
  const freshness = cluster.freshnessLabel ?? "—";
  const sourcesLine = formatClusterSourcesLine(cluster);
  const channelCounts = getClusterSourceChannelCounts(cluster);

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold leading-snug text-foreground">
        {cluster.title}
      </h3>

      {channelCounts.length > 0 ? (
        <ul
          className="mt-2 flex list-none flex-wrap gap-2 p-0"
          aria-label="Ingest channels"
        >
          {channelCounts.map(({ channel, count }) => (
            <li key={channel}>
              <SourceChannelBadge channel={channel} count={count} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 line-clamp-1 text-sm text-zinc-600">{cluster.summary}</p>

      {sourcesLine ? (
        <p className="mt-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-600">Sources: </span>
          {sourcesLine}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <StoryBadge key={t} variant="tag">
            {t}
          </StoryBadge>
        ))}
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
        <div>
          <dt className="sr-only">Sources</dt>
          <dd>
            {sourceCount} source{sourceCount === 1 ? "" : "s"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Freshness</dt>
          <dd>{freshness}</dd>
        </div>
        <div>
          <dt className="sr-only">Relevance</dt>
          <dd>{relevance}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <Link
          href={`/cluster/${cluster.id}`}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          View Story
        </Link>
      </div>
    </li>
  );
}
