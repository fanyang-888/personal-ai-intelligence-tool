const MAX_HASHTAGS = 5;

/**
 * Hashtag labels from a cluster's articles.
 * Returns an empty array in the current implementation — article tags
 * are not loaded in the frontend at draft-view time.
 */
export function collectHashtagLabelsFromClusterArticles(
  _clusterId: string,
): string[] {
  return [];
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
