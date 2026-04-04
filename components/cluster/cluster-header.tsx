"use client";

import { Badge } from "@/components/shared/badge";
import { useI18n } from "@/lib/i18n";
import { formatShortDateTime } from "@/lib/utils/format-date";
import { formatRelevancePercent } from "@/lib/utils/cluster-sources";
import type { Cluster } from "@/types/cluster";

type ClusterHeaderProps = {
  cluster: Cluster;
};

export function ClusterHeader({ cluster }: ClusterHeaderProps) {
  const { t, lang } = useI18n();
  const sourceCount = cluster.articleIds.length;
  const scoreLabel = formatRelevancePercent(cluster.clusterScore);
  const status = cluster.storyStatus ?? "—";

  return (
    <header className="mb-6">
      <Badge>{cluster.clusterType}</Badge>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {cluster.title}
      </h1>
      {cluster.subtitle ? (
        <p className="mt-2 text-sm text-zinc-600">{cluster.subtitle}</p>
      ) : null}

      <dl className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-zinc-500">{t.cluster.headerStoryStatus}</dt>
          <dd>{status}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-zinc-500">{t.cluster.headerSourceCount}</dt>
          <dd>{t.formatSourceCount(sourceCount)}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-zinc-500">{t.cluster.headerScore}</dt>
          <dd>{scoreLabel}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-zinc-500">{t.cluster.headerFirstSeen}</dt>
          <dd>{formatShortDateTime(cluster.firstSeenAt, lang)}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2 sm:col-span-2">
          <dt className="font-medium text-zinc-500">{t.cluster.headerLastUpdated}</dt>
          <dd>{formatShortDateTime(cluster.lastSeenAt, lang)}</dd>
        </div>
      </dl>
    </header>
  );
}
