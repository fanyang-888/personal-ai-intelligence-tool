/** Lower is better: earlier match in haystack = more relevant */
export function keywordMatchScore(haystack: string, keyword: string): number {
  const k = keyword.trim().toLowerCase();
  if (!k) return 0;
  const h = haystack.toLowerCase();
  const idx = h.indexOf(k);
  if (idx === -1) return 10_000;
  return idx;
}

export function sortByKeywordRelevance<T>(
  items: T[],
  getSearchableText: (item: T) => string,
  keyword: string,
): T[] {
  const k = keyword.trim();
  if (!k) return items;
  return [...items].sort(
    (a, b) =>
      keywordMatchScore(getSearchableText(a), k) -
      keywordMatchScore(getSearchableText(b), k),
  );
}
