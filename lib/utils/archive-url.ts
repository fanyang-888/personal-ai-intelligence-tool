/** Query keys: q, theme, source (source id e.g. src-1) */

export type ArchiveQuery = {
  q: string;
  theme: string;
  sourceId: string;
};

export function parseArchiveQuery(
  searchParams: Pick<URLSearchParams, "get">,
): ArchiveQuery {
  return {
    q: searchParams.get("q") ?? "",
    theme: searchParams.get("theme") ?? "",
    sourceId: searchParams.get("source") ?? "",
  };
}

export function serializeArchiveQuery(params: ArchiveQuery): string {
  const u = new URLSearchParams();
  const q = params.q.trim();
  if (q) u.set("q", q);
  if (params.theme) u.set("theme", params.theme);
  if (params.sourceId) u.set("source", params.sourceId);
  return u.toString();
}

export function archiveHref(params: ArchiveQuery): string {
  const qs = serializeArchiveQuery(params);
  return qs ? `/archive?${qs}` : "/archive";
}
