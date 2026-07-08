/**
 * Map API wire types (ApiCluster, ApiDraft, …) to the frontend domain types
 * (Cluster, Draft) used by existing components.
 */

import type { Article } from "@/types/article";
import type { Cluster } from "@/types/cluster";
import type { Draft } from "@/types/draft";
import type { LocalizedString } from "@/types/localized";
import type { ApiArchiveClusterRow, ApiCluster, ApiDraft } from "./types";

/** Build a bilingual LocalizedString. zh defaults to "" (falls back to en in pickLocalized). */
function ls(en: string, zh?: string | null): LocalizedString {
  return { en, zh: zh ?? "" };
}

export function apiClusterToCluster(c: ApiCluster): Cluster {
  return {
    id: c.id,
    clusterType: c.clusterType,
    title: ls(c.title.en, c.title.zh),
    theme: c.theme,
    themes: c.themes,
    tags: c.tags,
    topicTag: c.topicTag ?? undefined,
    storyStatus: c.storyStatus,
    clusterScore: c.clusterScore ?? undefined,
    freshnessLabel: c.freshnessLabel,
    firstSeenAt: c.firstSeenAt ?? new Date().toISOString(),
    lastSeenAt: c.lastSeenAt ?? new Date().toISOString(),
    summary: ls(c.summary.en, c.summary.zh),
    takeaways: c.takeaways.map((t) => ls(t.en, t.zh)),
    whyItMatters: ls(c.whyItMatters.en, c.whyItMatters.zh),
    audience: {
      pm: ls(c.audience.pm.en, c.audience.pm.zh),
      developer: ls(c.audience.developer.en, c.audience.developer.zh),
      studentJobSeeker: ls(
        c.audience.studentJobSeeker.en,
        c.audience.studentJobSeeker.zh,
      ),
    },
    articleIds: c.articleIds,
    articles: (c.articles ?? []).map<Article>((a) => ({
      id: a.id,
      clusterId: c.id,
      sourceId: "",
      title: a.title,
      url: a.url,
      publishedAt: a.publishedAt ?? "",
      excerpt: a.excerpt ?? "",
      tags: [],
      themes: [],
      organizationName: a.sourceName ?? undefined,
    })),
    relatedClusterIds: c.relatedClusterIds,
    draftId: c.draftId ?? undefined,
  };
}

/**
 * Build a card-renderable Cluster from an archive search row.
 * Fields the digest cards never read (takeaways, audience, …) get empty
 * defaults; articleIds is sized so `.length` reports the source count.
 */
export function archiveRowToCluster(
  row: ApiArchiveClusterRow,
  freshnessLabel?: string,
): Cluster {
  return {
    id: row.id,
    clusterType: "event",
    title: ls(row.title, row.title_zh),
    theme: row.theme,
    tags: row.tags,
    topicTag: row.topicTag ?? undefined,
    storyStatus: row.storyStatus,
    clusterScore: row.clusterScore ?? undefined,
    freshnessLabel,
    firstSeenAt: row.lastSeenAt ?? "",
    lastSeenAt: row.lastSeenAt ?? "",
    summary: ls(row.summary ?? "", row.summary_zh),
    takeaways: [],
    whyItMatters: ls(""),
    audience: { pm: ls(""), developer: ls(""), studentJobSeeker: ls("") },
    articleIds: new Array<string>(Math.max(row.sourceCount, 0)).fill(""),
    relatedClusterIds: [],
  };
}

export function apiDraftToDraft(d: ApiDraft): Draft {
  const rawTakeaways = d.takeaways.slice(0, 3).map((t) => ls(t.en, t.zh));
  while (rawTakeaways.length < 3) rawTakeaways.push(ls(""));
  const takeaways = rawTakeaways as [LocalizedString, LocalizedString, LocalizedString];

  return {
    id: d.id,
    clusterId: d.clusterId ?? "",
    draftType: "linkedin",
    title: ls(d.title.en, d.title.zh),
    generatedAt: d.generatedAt ?? undefined,
    hook: ls(d.hook.en, d.hook.zh),
    summaryBlock: ls(d.summaryBlock.en, d.summaryBlock.zh),
    takeaways,
    careerInterpretationBlock: ls(
      d.careerInterpretationBlock.en,
      d.careerInterpretationBlock.zh,
    ),
    audienceWhyItMattersBlock: ls(
      d.audienceWhyItMattersBlock.en,
      d.audienceWhyItMattersBlock.zh,
    ),
    closingBlock: d.closingBlock
      ? ls(d.closingBlock.en, d.closingBlock.zh)
      : undefined,
  };
}
