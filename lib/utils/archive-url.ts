/** Query keys: q, theme, source (source id), channel (ingest: email|chat|web|feed) */

import type { SourceChannel } from "@/types/source";

export type ArchiveQuery = {
  q: string;
  theme: string;
  sourceId: string;
  channel: string;
};

const VALID_CHANNELS: readonly SourceChannel[] = [
  "email",
  "chat",
  "web",
  "feed",
];

function normalizeChannel(raw: string | null): string {
  const v = (raw ?? "").trim();
  return VALID_CHANNELS.includes(v as SourceChannel) ? v : "";
}

export function parseArchiveQuery(
  searchParams: Pick<URLSearchParams, "get">,
): ArchiveQuery {
  return {
    q: searchParams.get("q") ?? "",
    theme: searchParams.get("theme") ?? "",
    sourceId: searchParams.get("source") ?? "",
    channel: normalizeChannel(searchParams.get("channel")),
  };
}

export function serializeArchiveQuery(params: ArchiveQuery): string {
  const u = new URLSearchParams();
  const q = params.q.trim();
  if (q) u.set("q", q);
  if (params.theme) u.set("theme", params.theme);
  if (params.sourceId) u.set("source", params.sourceId);
  if (params.channel) u.set("channel", params.channel);
  return u.toString();
}

export function archiveHref(params: ArchiveQuery): string {
  const qs = serializeArchiveQuery(params);
  return qs ? `/archive?${qs}` : "/archive";
}

/** Deep link from digest cards: filter archive by ingest channel only. */
export function archiveChannelHref(channel: SourceChannel): string {
  return archiveHref({
    q: "",
    theme: "",
    sourceId: "",
    channel,
  });
}
