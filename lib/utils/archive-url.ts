/** Query keys: q, topic (topic group key), source (source id), channel (ingest: email|chat|web|feed) */

import type { SourceChannel } from "@/types/source";
import { isTopicGroupKey, type TopicGroupKey } from "@/lib/constants/topic-groups";

export type ArchiveQuery = {
  q: string;
  topic: string;
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

function normalizeTopic(raw: string | null): string {
  const v = (raw ?? "").trim();
  return isTopicGroupKey(v) ? v : "";
}

export function parseArchiveQuery(
  searchParams: Pick<URLSearchParams, "get">,
): ArchiveQuery {
  return {
    q: searchParams.get("q") ?? "",
    topic: normalizeTopic(searchParams.get("topic")),
    sourceId: searchParams.get("source") ?? "",
    channel: normalizeChannel(searchParams.get("channel")),
  };
}

export function serializeArchiveQuery(params: ArchiveQuery): string {
  const u = new URLSearchParams();
  const q = params.q.trim();
  if (q) u.set("q", q);
  if (params.topic) u.set("topic", params.topic);
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
    topic: "",
    sourceId: "",
    channel,
  });
}

/** Deep link from the homepage category bar: filter archive by topic group only. */
export function archiveTopicHref(topic: TopicGroupKey): string {
  return archiveHref({
    q: "",
    topic,
    sourceId: "",
    channel: "",
  });
}
