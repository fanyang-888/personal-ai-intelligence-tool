"use client";

import Link from "next/link";
import { StoryBadge } from "@/components/digest/story-badge";
import { IngestChannelRow } from "@/components/digest/ingest-channel-row";
import { ActionRow } from "@/components/shared/action-row";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { uiMetaText, uiTextLinkPrimary } from "@/lib/ui/classes";
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
    <ResultCardFrame
      as="section"
      variant="digestFeatured"
      className={className}
      statusKey={cluster.storyStatus ?? undefined}
      aria-labelledby="featured-story-title"
    >
      <h2
        id="featured-story-title"
        className="text-2xl leading-tight tracking-tight sm:text-[1.65rem]"
        style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: "var(--sp-navy)" }}
      >
        {pickLocalized(cluster.title, lang)}
      </h2>
      {cluster.subtitle ? (
        <p className="mt-2 text-sm text-zinc-500">
          {pickLocalized(cluster.subtitle, lang)}
        </p>
      ) : null}

      {visibleChannels.length > 0 ? (
        <IngestChannelRow
          visibleChannels={visibleChannels}
          extraTypeCount={extraTypeCount}
          className="mt-3"
        />
      ) : null}

      {sourcesLine ? (
        <p className={`mt-3 ${uiMetaText}`}>
          <span className="font-medium text-zinc-600">
            {t.digest.sourcesPrefix}{" "}
          </span>
          {sourcesLine}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <StoryBadge variant="status" statusKey={cluster.storyStatus}>{status}</StoryBadge>
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

      <ActionRow className="mt-6">
        <Link href={`/cluster/${cluster.id}`} className={uiTextLinkPrimary}>
          {t.digest.viewStory}
        </Link>
        {cluster.draftId ? (
          <Link href={`/draft/${cluster.draftId}`} className={uiTextLinkPrimary}>
            {t.digest.openDraft}
          </Link>
        ) : (
          <span className="text-sm text-zinc-500">{t.digest.noDraftLinked}</span>
        )}
      </ActionRow>
    </ResultCardFrame>
  );
}
