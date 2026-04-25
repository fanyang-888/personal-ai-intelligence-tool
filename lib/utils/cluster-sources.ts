import type { SourceChannel } from "@/types/source";

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

/**
 * Channel counts per cluster — returns empty array since article channel
 * data is not loaded in the frontend at cluster-view time.
 */
export function getClusterSourceChannelCounts(_cluster?: unknown): SourceChannelCount[] {
  return [];
}

/** e.g. "The Register · Ars Technica" or "A · B · C +2" */
export function formatClusterSourcesLine(_clusterOrLabels?: unknown): string {
  return "";
}

export function formatRelevancePercent(score: number | undefined): string {
  if (score === undefined) return "—";
  return `${score}% relevant`;
}
