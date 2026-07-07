/**
 * Topic groups — single source of truth for the CNN-style category bar
 * and the archive category filter.
 *
 * Each group maps to one or more canonical backend `topic_tag` values
 * (defined in backend/app/services/summarization.py). The frontend expands
 * a group into its tags before calling the API; the backend never sees
 * group keys. "Other" is deliberately not exposed as a group.
 */

import type { Lang } from "@/lib/i18n";

export type TopicGroupKey =
  | "models"
  | "research"
  | "funding"
  | "products"
  | "policy"
  | "opensource";

export type TopicGroup = {
  key: TopicGroupKey;
  /** Canonical backend topic_tag values covered by this group. */
  tags: string[];
  label: { en: string; zh: string };
};

export const TOPIC_GROUPS: TopicGroup[] = [
  { key: "models", tags: ["Model Release"], label: { en: "Models", zh: "模型发布" } },
  { key: "research", tags: ["Research", "Benchmark"], label: { en: "Research", zh: "研究" } },
  { key: "funding", tags: ["Funding"], label: { en: "Funding", zh: "融资" } },
  { key: "products", tags: ["Product Launch"], label: { en: "Products", zh: "产品" } },
  { key: "policy", tags: ["Regulation", "Safety"], label: { en: "Policy & Safety", zh: "政策与安全" } },
  { key: "opensource", tags: ["Open Source", "Infrastructure"], label: { en: "Open Source & Infra", zh: "开源与基建" } },
];

/** Label for the default "Trending" entry on the homepage category bar. */
export const TRENDING_LABEL = { en: "Trending", zh: "热门" } as const;

export function isTopicGroupKey(key: string): key is TopicGroupKey {
  return TOPIC_GROUPS.some((g) => g.key === key);
}

export function topicGroupByKey(key: string): TopicGroup | undefined {
  return TOPIC_GROUPS.find((g) => g.key === key);
}

export function topicTagsForGroup(key: string): string[] {
  return topicGroupByKey(key)?.tags ?? [];
}

export function topicGroupLabel(group: TopicGroup, lang: Lang): string {
  return lang === "zh" ? group.label.zh : group.label.en;
}
