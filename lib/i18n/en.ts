import type { Translations } from "./types";

export const en: Translations = {
  nav: {
    dailyDigest: "Daily Digest",
    archive: "Archive",
    draftOfDay: "Draft of the Day",
    searchPlaceholder: "Search archive…",
    searchAria: "Site search",
    mainAria: "Main",
  },
  home: {
    title: "Daily AI Digest",
    subtitle:
      "Top ranked AI updates with cross-source synthesis and practical context",
    emptyFeaturedTitle: "No featured story",
    emptyFeaturedDesc: "Add a featured cluster in mock data.",
    emptyDraftTitle: "No draft of the day",
    emptyDraftDesc: "Mock digest has no draft entry.",
    topClusters: "Top Story Clusters",
    viewAllInsights: "View all daily insights",
    emptyClustersTitle: "Waiting for more data",
    emptyClustersDesc:
      "We need a bit more signal to synthesize today's clusters. Check back soon or browse the archive.",
    goToArchive: "Go to Archive",
  },
  formatSourceCount: (n) => (n === 1 ? `${n} source` : `${n} sources`),
  digest: {
    ingestChannelsAria: "Ingest channels",
    sourcesPrefix: "Sources:",
    whyItMattersPrefix: "Why it matters:",
    viewStory: "View Story",
    openDraft: "Open Draft",
    noDraftLinked: "No draft linked for this cluster.",
    featuredFallback: "Featured",
    formatMoreChannelTypesHidden: (n) =>
      `${n} more ingest channel types not shown`,
    srOnlySources: "Sources",
    srOnlyFreshness: "Freshness",
    srOnlyRelevance: "Relevance",
    formatChannelBadgeAria: (c, label) =>
      `${c === 1 ? "1 source" : `${c} sources`} from ${label}`,
    formatChannelArchiveLinkAria: (c, label) =>
      `${c === 1 ? "1 source" : `${c} sources`} from ${label}. Open archive filtered by ${label}`,
    formatChannelArchiveLinkTitle: (c, label) =>
      `${c === 1 ? "1 source" : `${c} sources`} from ${label} — filter archive`,
  },
  draftPreview: {
    sectionTitle: "Draft of the Day",
    relatedStory: "Related story:",
    openFullDraft: "Open Full Draft",
  },
  discover: {
    title: "Discover in the Archive",
    bodyBeforeEmphasis:
      "Browse the full catalog of synthesized clusters and sources. Use the ",
    bodyEmphasis: "search field in the header",
    bodyAfterEmphasis: " to find companies, models, themes, or keywords.",
    cta: "Go to Archive",
  },
  archive: {
    title: "Archive",
    description:
      "Retrieve intelligence you have already surfaced — search mock clusters and sources. Everything runs locally in this MVP.",
    searchPlaceholder: "Keyword in title or summary…",
    searchLabel: "Search",
    results: "Results",
    emptyCatalog: "No clusters in catalog",
    emptyCatalogArticles: "No articles in catalog",
    noResultsTitle: "No results",
    noResultsMessage:
      "Try a different keyword, theme, source, or channel.",
    filterTheme: "Theme",
    filterSource: "Source",
    filterChannel: "Channel",
    allThemes: "All themes",
    allSources: "All sources",
    allChannels: "All channels",
    loading: "Loading archive…",
    resultModeClusters: "Clusters",
    resultModeArticles: "Articles",
    resultModeGroupAria: "Result type",
    publishedLabel: "Published",
    relatedCluster: "Related cluster",
  },
  channels: {
    email: "Email",
    chat: "Chat",
    web: "Web",
    feed: "Feed",
  },
  cluster: {
    summary: "Summary",
    takeaways: "Takeaways",
    whyItMatters: "Why it matters",
    whyItMattersForYou: "Why it matters for you",
    audiencePm: "PMs",
    audienceDeveloper: "Developers",
    audienceStudent: "Students & job seekers",
    coveredSources: "Covered sources",
    relatedStories: "Related stories",
    draftSectionTitle: "Draft",
    draftSectionLead:
      "Open the linked draft for a shareable brief and career-oriented notes.",
    openDraft: "Open draft",
    bilingualAssistTrustNote:
      "Chinese text is provided as reading assistance. Refer to the original language for exact wording.",
    sourceOriginalPreservedNote:
      "Source titles and excerpts stay in their original language for accuracy and traceability.",
    headerStoryStatus: "Status",
    headerSourceCount: "Coverage",
    headerScore: "Cluster score",
    headerFirstSeen: "First seen",
    headerLastUpdated: "Last updated",
    emptyCoveredSources: "No linked articles in the mock catalog for this cluster.",
    credibilityPrefix: "Credibility:",
    noDraftLinked:
      "There is no linked draft for this cluster yet. You can still use the summary and takeaways above.",
    draftProminentLead:
      "You have a draft for this cluster—open it to turn this signal into a shareable brief or post.",
    draftCompactLead: "Continue your draft while you read.",
    breadcrumbAria: "Breadcrumb",
    backToDigest: "Back to Daily Digest",
    nextStory: "Next story",
    formatReadTimeMinutes: (minutes) =>
      `${minutes} min read`,
    formatSourceDiversityBroad: (outlets, articles) =>
      `${outlets} outlet${outlets === 1 ? "" : "s"} · ${articles} article${articles === 1 ? "" : "s"} — broad cross-source check`,
    formatSourceDiversityNarrow: (outlets, articles) =>
      `${outlets} outlet${outlets === 1 ? "" : "s"} · ${articles} article${articles === 1 ? "" : "s"} — narrow sourcing (verify claims carefully)`,
    allCaughtUpToday: "You're all caught up for today.",
    caughtUpViewArchive: "View Archive",
    draftStickyBadge: "Follow draft",
  },
  draft: {
    draftOfDayPageTitle: "Draft of the Day",
    draftForStoryPageTitle: (storyTitle) => `Draft for ${storyTitle}`,
    workingTitleLabel: "Working title",
    linkedInDraftType: "LinkedIn-style draft",
    generatedPrefix: "Generated",
    relatedStorySection: "Related story",
    viewSourceStory: "View source story",
    backToStory: "Back to story",
    clusterNotInCatalog:
      "This story id is not in the local mock catalog. You can still open the cluster route or return to the digest.",
    expandRelatedStory: "Show story summary",
    collapseRelatedStory: "Hide story summary",
    sectionHook: "Hook",
    sectionSummary: "Concise update",
    takeawaysIntro: "Three takeaways",
    sectionCareerAngle: "Career angle",
    sectionWhyItMatters: "Why this matters",
    sectionClosing: "Closing",
    suggestedHashtags: "Suggested hashtags",
    copyDraft: "Copy draft",
    copied: "Copied",
    regenerate: "Regenerate draft",
    formatVariantHint: (variant, total) =>
      `Variant ${variant} of ${total} (local mock)`,
    regenerateNoVariants:
      "No alternate mock variant—content unchanged (local preview only).",
    copyUnavailable: "Copy unavailable in this browser context.",
    formatDraftCharacterCount: (current, limit) =>
      `${current.toLocaleString()} / ${limit.toLocaleString()} characters`,
    characterCountOverSoftLimit:
      "Above a comfortable single-post length for many networks—consider trimming.",
    notesTitle: "Notes",
    notesBody:
      "Editing in-app is out of scope for this sprint. Copy the draft and refine in your notes app or doc, then save pointers back in your own workflow.",
    bilingualAssistTrustNote:
      "Chinese text is provided as reading assistance. Refer to the original language for exact wording.",
  },
  notFound: {
    clusterTitle: "Story cluster not found",
    clusterMessage: "That cluster id is not in the local mock catalog.",
    draftTitle: "Draft not found",
    draftMessage: "That draft id is not in the local mock catalog.",
  },
};
