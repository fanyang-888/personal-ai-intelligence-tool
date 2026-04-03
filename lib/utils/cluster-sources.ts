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

export type SourceChannelCount = { channel: SourceChannel; count: number };

/** Counts mock ingest channels per cluster (for scannable “where it came from”). */
export function getClusterSourceChannelCounts(
  cluster: Cluster,
): SourceChannelCount[] {
  const map = new Map<SourceChannel, number>();
  for (const id of cluster.sourceIds) {
    const s = getSourceById(id);
    const ch = s?.channel ?? DEFAULT_CHANNEL;
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([channel, count]) => ({ channel, count }))
    .sort(
      (a, b) =>
        b.count - a.count || CHANNEL_SORT[a.channel] - CHANNEL_SORT[b.channel],
    );
}

/** Short labels for trust/transparency on digest cards (publisher preferred). */
export function getClusterSourceLabels(cluster: Cluster): string[] {
  return cluster.sourceIds
    .map((id) => {
      const s = getSourceById(id);
      if (!s) return null;
      return s.publisher ?? s.name;
    })
    .filter((x): x is string => Boolean(x));
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
