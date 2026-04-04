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
    /** Shown above story body when UI is localized but mock content stays in English. */
    contentOriginalLanguageHint: string;
    headerStoryStatus: string;
    headerSourceCount: string;
    headerScore: string;
    headerFirstSeen: string;
    headerLastUpdated: string;
    emptyCoveredSources: string;
    credibilityPrefix: string;
    noDraftLinked: string;
  };
  draft: {
    topicLabel: string;
    linkedClusterPrefix: string;
    takeaways: string;
    careerInterpretation: string;
    notesTitle: string;
    notesBody: string;
    backToCluster: string;
    copy: string;
    copied: string;
    regenerate: string;
    formatVariantHint: (variant: number, total: number) => string;
  };
  notFound: {
    clusterTitle: string;
    clusterMessage: string;
    draftTitle: string;
    draftMessage: string;
  };
};
