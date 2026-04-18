import type { SourceChannel } from "@/types/source";

const MAX_VISIBLE = 4;

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

const CHANNEL_SORT: Record<SourceChannel, number> = {
  email: 0,
  chat: 1,
  web: 2,
  feed: 3,
};

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

/**
 * Channel counts per cluster — returns empty array since article channel
 * data is not loaded in the frontend at cluster-view time.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClusterSourceChannelCounts(_cluster?: any): SourceChannelCount[] {
  return [];
}

/**
 * Source outlet labels for a cluster — returns empty array since full
 * article metadata is not loaded in the frontend at cluster-view time.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClusterSourceLabels(_cluster?: any): string[] {
  return [];
}

/** e.g. "The Register · Ars Technica" or "A · B · C +2" */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatClusterSourcesLine(_clusterOrLabels?: any): string {
  return "";
}

export function formatRelevancePercent(score: number | undefined): string {
  if (score === undefined) return "—";
  return `${score}% relevant`;
}
