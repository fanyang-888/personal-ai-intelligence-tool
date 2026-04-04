import { getArticleById } from "@/lib/mock-data/articles";
import { getSourceById } from "@/lib/mock-data/sources";
import type { Cluster } from "@/types/cluster";
import type { SourceChannel } from "@/types/source";

const MAX_VISIBLE = 4;

const DEFAULT_CHANNEL: SourceChannel = "web";

const CHANNEL_SORT: Record<SourceChannel, number> = {
  email: 0,
  chat: 1,
  web: 2,
  feed: 3,
};

/** UI labels for filters and badges (single source of truth). */
export const SOURCE_CHANNEL_LABEL: Record<SourceChannel, string> = {
  email: "Email",
  chat: "Chat",
  web: "Web",
  feed: "Feed",
};

export const SOURCE_CHANNELS_ALL: SourceChannel[] = [
  "email",
  "chat",
  "web",
  "feed",
];

export type SourceChannelCount = { channel: SourceChannel; count: number };

/** When more than `maxTypes` distinct channels, show first N + "+M" overflow. */
export function partitionChannelCountsForDisplay(
  counts: SourceChannelCount[],
  maxTypes = 3,
): { visible: SourceChannelCount[]; extraTypeCount: number } {
  if (counts.length <= maxTypes) {
    return { visible: counts, extraTypeCount: 0 };
  }
  return {
    visible: counts.slice(0, maxTypes),
    extraTypeCount: counts.length - maxTypes,
  };
}

/** Counts mock ingest channels per cluster (per linked article). */
export function getClusterSourceChannelCounts(
  cluster: Cluster,
): SourceChannelCount[] {
  const map = new Map<SourceChannel, number>();
  for (const id of cluster.articleIds) {
    const art = getArticleById(id);
    if (!art) continue;
    const s = getSourceById(art.sourceId);
    const ch = art.channel ?? s?.channel ?? DEFAULT_CHANNEL;
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([channel, count]) => ({ channel, count }))
    .sort(
      (a, b) =>
        b.count - a.count || CHANNEL_SORT[a.channel] - CHANNEL_SORT[b.channel],
    );
}

/** Unique outlet labels in article order (publisher preferred). */
export function getClusterSourceLabels(cluster: Cluster): string[] {
  const labels: string[] = [];
  const seen = new Set<string>();
  for (const id of cluster.articleIds) {
    const art = getArticleById(id);
    if (!art) continue;
    const s = getSourceById(art.sourceId);
    if (!s) continue;
    const label = s.publisher ?? s.name;
    if (seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}

/** e.g. "The Register · Ars Technica" or "A · B · C +2" */
export function formatClusterSourcesLine(cluster: Cluster): string {
  const labels = getClusterSourceLabels(cluster);
  if (labels.length === 0) return "";
  const shown = labels.slice(0, MAX_VISIBLE);
  const rest = labels.length - shown.length;
  const suffix = rest > 0 ? ` +${rest}` : "";
  return `${shown.join(" · ")}${suffix}`;
}

export function formatRelevancePercent(score: number | undefined): string {
  if (score === undefined) return "—";
  return `${score}% relevant`;
}
