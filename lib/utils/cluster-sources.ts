import { getSourceById } from "@/lib/mock-data/sources";
import type { Cluster } from "@/types/cluster";

const MAX_VISIBLE = 4;

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
