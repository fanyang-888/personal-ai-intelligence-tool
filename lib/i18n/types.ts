import type { SourceChannel } from "@/types/source";

export type Lang = "en" | "zh";

export type ChannelLabels = Record<SourceChannel, string>;

export type Translations = {
  nav: {
    dailyDigest: string;
    archive: string;
    draftOfDay: string;
    searchPlaceholder: string;
    searchAria: string;
    mainAria: string;
  };
  home: {
    title: string;
    subtitle: string;
    emptyFeaturedTitle: string;
    emptyFeaturedDesc: string;
    emptyDraftTitle: string;
    emptyDraftDesc: string;
    topClusters: string;
    viewAllInsights: string;
    emptyClustersTitle: string;
    emptyClustersDesc: string;
    goToArchive: string;
  };
  digest: {
    ingestChannelsAria: string;
    sourcesPrefix: string;
    whyItMattersPrefix: string;
    viewStory: string;
    openDraft: string;
    noDraftLinked: string;
    featuredFallback: string;
    formatMoreChannelTypesHidden: (extraTypeCount: number) => string;
    srOnlySources: string;
    srOnlyFreshness: string;
    srOnlyRelevance: string;
    formatChannelBadgeAria: (count: number, channelLabel: string) => string;
    formatChannelArchiveLinkAria: (
      count: number,
      channelLabel: string,
    ) => string;
    formatChannelArchiveLinkTitle: (
      count: number,
      channelLabel: string,
    ) => string;
  };
  formatSourceCount: (n: number) => string;
  draftPreview: {
    sectionTitle: string;
    relatedStory: string;
    openFullDraft: string;
  };
  discover: {
    title: string;
    bodyBeforeEmphasis: string;
    bodyEmphasis: string;
    bodyAfterEmphasis: string;
    cta: string;
  };
  archive: {
    title: string;
    description: string;
    searchPlaceholder: string;
    searchLabel: string;
    results: string;
    emptyCatalog: string;
    noResultsTitle: string;
    noResultsMessage: string;
    filterTheme: string;
    filterSource: string;
    filterChannel: string;
    allThemes: string;
    allSources: string;
    allChannels: string;
    loading: string;
    resultModeClusters: string;
    resultModeArticles: string;
    resultModeGroupAria: string;
    publishedLabel: string;
    relatedCluster: string;
    emptyCatalogArticles: string;
    suggestThemesLead: string;
  };
  channels: ChannelLabels;
  cluster: {
    summary: string;
    takeaways: string;
    whyItMatters: string;
    whyItMattersForYou: string;
    audiencePm: string;
    audienceDeveloper: string;
    audienceStudent: string;
    coveredSources: string;
    relatedStories: string;
    draftSectionTitle: string;
    draftSectionLead: string;
    openDraft: string;
    /** Shown in Chinese mode above product-structured story body (bilingual assist disclaimer). */
    bilingualAssistTrustNote: string;
    /** Under covered sources: originals stay in source language. */
    sourceOriginalPreservedNote: string;
    headerStoryStatus: string;
    headerSourceCount: string;
    headerScore: string;
    headerFirstSeen: string;
    headerLastUpdated: string;
    emptyCoveredSources: string;
    credibilityPrefix: string;
    noDraftLinked: string;
    draftProminentLead: string;
    draftCompactLead: string;
    breadcrumbAria: string;
    backToDigest: string;
    nextStory: string;
    formatReadTimeMinutes: (minutes: number) => string;
    formatSourceDiversityBroad: (outlets: number, articles: number) => string;
    formatSourceDiversityNarrow: (outlets: number, articles: number) => string;
    allCaughtUpToday: string;
    caughtUpViewArchive: string;
    draftStickyBadge: string;
  };
  draft: {
    draftOfDayPageTitle: string;
    draftForStoryPageTitle: (storyTitle: string) => string;
    workingTitleLabel: string;
    linkedInDraftType: string;
    generatedPrefix: string;
    relatedStorySection: string;
    viewSourceStory: string;
    backToStory: string;
    clusterNotInCatalog: string;
    expandRelatedStory: string;
    collapseRelatedStory: string;
    sectionHook: string;
    sectionSummary: string;
    takeawaysIntro: string;
    sectionCareerAngle: string;
    sectionWhyItMatters: string;
    sectionClosing: string;
    suggestedHashtags: string;
    copyDraft: string;
    copied: string;
    regenerate: string;
    formatVariantHint: (variant: number, total: number) => string;
    regenerateNoVariants: string;
    copyUnavailable: string;
    formatDraftCharacterCount: (current: number, limit: number) => string;
    characterCountOverSoftLimit: string;
    notesTitle: string;
    notesBody: string;
    /** Same trust line as cluster page when draft UI is in Chinese mode. */
    bilingualAssistTrustNote: string;
  };
  notFound: {
    clusterTitle: string;
    clusterMessage: string;
    draftTitle: string;
    draftMessage: string;
  };
};
