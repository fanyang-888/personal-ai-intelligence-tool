"use client";

import Link from "next/link";
import { SourceChannelBadge } from "@/components/digest/source-channel-badge";
import { StoryBadge } from "@/components/digest/story-badge";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { archiveChannelHref } from "@/lib/utils/archive-url";
import {
  formatClusterSourcesLine,
  formatRelevancePercent,
  getClusterSourceChannelCounts,
  partitionChannelCountsForDisplay,
} from "@/lib/utils/cluster-sources";
import type { Cluster } from "@/types/cluster";

type FeaturedStoryCardProps = {
  cluster: Cluster;
  className?: string;
};

export function FeaturedStoryCard({
  cluster,
  className = "",
}: FeaturedStoryCardProps) {
  const { t, lang } = useI18n();
  const sourceCount = cluster.articleIds.length;
  const relevance = formatRelevancePercent(cluster.clusterScore);
  const status = cluster.storyStatus ?? t.digest.featuredFallback;
  const sourcesLine = formatClusterSourcesLine(cluster);
  const channelCounts = getClusterSourceChannelCounts(cluster);
  const { visible: visibleChannels, extraTypeCount } =
    partitionChannelCountsForDisplay(channelCounts, 3);

  return (
    <section
      className={`rounded-lg border border-zinc-200 border-l-4 border-l-emerald-600 bg-white p-6 shadow-sm sm:p-8 ${className}`}
      aria-labelledby="featured-story-title"
    >
      <h2
        id="featured-story-title"
        className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.65rem]"
      >
        {pickLocalized(cluster.title, lang)}
      </h2>
      {cluster.subtitle ? (
        <p className="mt-2 text-sm text-zinc-500">
          {pickLocalized(cluster.subtitle, lang)}
        </p>
      ) : null}

      {visibleChannels.length > 0 ? (
        <ul
          className="mt-3 flex list-none flex-wrap gap-1.5 p-0 sm:gap-2"
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

      {sourcesLine ? (
        <p className="mt-3 text-xs text-zinc-500">
          <span className="font-medium text-zinc-600">
            {t.digest.sourcesPrefix}{" "}
          </span>
          {sourcesLine}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <StoryBadge variant="status">{status}</StoryBadge>
        <StoryBadge variant="metric">
          {t.formatSourceCount(sourceCount)}
        </StoryBadge>
        <StoryBadge variant="metric">{relevance}</StoryBadge>
      </div>

      <p className="mt-5 text-base leading-relaxed text-foreground">
        {pickLocalized(cluster.summary, lang)}
      </p>

      <p className="mt-4 text-sm font-medium text-zinc-600">
        <span className="text-zinc-500">{t.digest.whyItMattersPrefix} </span>
        {pickLocalized(cluster.whyItMatters, lang)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={`/cluster/${cluster.id}`}
          className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {t.digest.viewStory}
        </Link>
        {cluster.draftId ? (
          <Link
            href={`/draft/${cluster.draftId}`}
            className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
          >
            {t.digest.openDraft}
          </Link>
        ) : (
          <span className="text-sm text-zinc-500">{t.digest.noDraftLinked}</span>
        )}
      </div>
    </section>
  );
}
