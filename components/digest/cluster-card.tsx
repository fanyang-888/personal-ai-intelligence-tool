"use client";

import Link from "next/link";
import { StoryBadge } from "@/components/digest/story-badge";
import { IngestChannelRow } from "@/components/digest/ingest-channel-row";
import { MetaRow } from "@/components/shared/meta-row";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { ScoreBar } from "@/components/shared/score-bar";
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

type ClusterCardProps = {
  cluster: Cluster;
};

export function ClusterCard({ cluster }: ClusterCardProps) {
  const { t, lang } = useI18n();
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
    <ResultCardFrame as="li" variant="digest">
      <h3 className="text-base font-semibold leading-snug text-foreground">
        {pickLocalized(cluster.title, lang)}
      </h3>

      {visibleChannels.length > 0 ? (
        <IngestChannelRow
          visibleChannels={visibleChannels}
          extraTypeCount={extraTypeCount}
          className="mt-2"
        />
      ) : null}

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">
        {pickLocalized(cluster.summary, lang)}
      </p>

      {sourcesLine ? (
        <p className={`mt-2 ${uiMetaText}`}>
          <span className="font-medium text-zinc-600">
            {t.digest.sourcesPrefix}{" "}
          </span>
          {sourcesLine}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <StoryBadge variant="status" statusKey={cluster.storyStatus}>
          {status}
        </StoryBadge>
        {tags.map((tag) => (
          <StoryBadge key={tag} variant="tag">
            {tag}
          </StoryBadge>
        ))}
      </div>

      <MetaRow
        dense
        className="mt-3"
        items={[
          {
            label: t.digest.srOnlySources,
            value: t.formatSourceCount(sourceCount),
            labelSrOnly: true,
          },
          {
            label: t.digest.srOnlyFreshness,
            value: freshness,
            labelSrOnly: true,
          },
          {
            label: t.digest.srOnlyRelevance,
            value: relevance,
            labelSrOnly: true,
          },
        ]}
      />

      <div className="mt-4">
        <Link href={`/cluster/${cluster.id}`} className={uiTextLinkPrimary}>
          {t.digest.viewStory}
        </Link>
      </div>

      <ScoreBar score={cluster.clusterScore} />
    </ResultCardFrame>
  );
}
