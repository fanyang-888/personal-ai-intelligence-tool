import { getArticlesByClusterId } from "@/lib/mock-data/articles";

const MAX_HASHTAGS = 5;

/** Unique article tags for a cluster, first-seen order, capped at 5. */
export function collectHashtagLabelsFromClusterArticles(
  clusterId: string,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const article of getArticlesByClusterId(clusterId)) {
    for (const raw of article.tags) {
      const tag = raw.trim();
      if (!tag) continue;
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(tag);
      if (out.length >= MAX_HASHTAGS) return out;
    }
  }
  return out;
}

/** LinkedIn-style tokens: alphanumeric only, concatenated (e.g. "Enterprise AI" → #EnterpriseAI). */
export function labelToHashtagToken(label: string): string {
  const compact = label.replace(/[^a-zA-Z0-9]+/g, "");
  if (!compact) return "";
  return `#${compact}`;
}

export function formatHashtagLine(labels: string[]): string {
  return labels
    .map(labelToHashtagToken)
    .filter(Boolean)
    .join(" ");
}
