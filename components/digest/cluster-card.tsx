"use client";

import Link from "next/link";
import { SourceChannelBadge } from "@/components/digest/source-channel-badge";
import { StoryBadge } from "@/components/digest/story-badge";
import { useI18n } from "@/lib/i18n";
import { archiveChannelHref } from "@/lib/utils/archive-url";
import {
  formatClusterSourcesLine,
  formatRelevancePercent,
  getClusterSourceChannelCounts,
  partitionChannelCountsForDisplay,
} from "@/lib/utils/cluster-sources";
import type { Cluster } from "@/types/cluster";

type ClusterCardProps = {
  cluster: Cluster;
};

export function ClusterCard({ cluster }: ClusterCardProps) {
  const { t } = useI18n();
  const tags = cluster.tags?.length ? cluster.tags : [cluster.theme];
  const sourceCount = cluster.articleIds.length;
  const status = cluster.storyStatus ?? t.digest.featuredFallback;
  const relevance = formatRelevancePercent(cluster.clusterScore);
  const freshness = cluster.freshnessLabel ?? "—";
  const sourcesLine = formatClusterSourcesLine(cluster);
  const channelCounts = getClusterSourceChannelCounts(cluster);
  const { visible: visibleChannels, extraTypeCount } =
    partitionChannelCountsForDisplay(channelCounts, 3);

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold leading-snug text-foreground">
        {cluster.title}
      </h3>

      {visibleChannels.length > 0 ? (
        <ul
          className="mt-2 flex list-none flex-wrap gap-1.5 p-0 sm:gap-2"
          aria-label={t.digest.ingestChannelsAria}
        >
          {visibleChannels.map(({ channel, count }) => (
            <li key={channel}>
              <SourceChannelBadge
                channel={channel}
                count={count}
                href={archiveChannelHref(channel)}
              />
            </li>
          ))}
          {extraTypeCount > 0 ? (
            <li>
              <span
                className="inline-flex items-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-500"
                title={t.digest.formatMoreChannelTypesHidden(extraTypeCount)}
              >
                +{extraTypeCount}
              </span>
            </li>
          ) : null}
        </ul>
      ) : null}

      <p className="mt-2 line-clamp-1 text-sm text-zinc-600">{cluster.summary}</p>

      {sourcesLine ? (
        <p className="mt-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-600">
            {t.digest.sourcesPrefix}{" "}
          </span>
          {sourcesLine}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <StoryBadge variant="status">{status}</StoryBadge>
        {tags.map((tag) => (
          <StoryBadge key={tag} variant="tag">
            {tag}
          </StoryBadge>
        ))}
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
        <div>
          <dt className="sr-only">{t.digest.srOnlySources}</dt>
          <dd>{t.formatSourceCount(sourceCount)}</dd>
        </div>
        <div>
          <dt className="sr-only">{t.digest.srOnlyFreshness}</dt>
          <dd>{freshness}</dd>
        </div>
        <div>
          <dt className="sr-only">{t.digest.srOnlyRelevance}</dt>
          <dd>{relevance}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <Link
          href={`/cluster/${cluster.id}`}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {t.digest.viewStory}
        </Link>
      </div>
    </li>
  );
}
