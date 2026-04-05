import type { LocalizedString } from "@/types/localized";

/** Blocks for one LinkedIn-style draft snapshot (primary or a mock variant). */
export type LinkedInDraftContent = {
  hook: LocalizedString;
  summaryBlock: LocalizedString;
  takeaways: [LocalizedString, LocalizedString, LocalizedString];
  careerInterpretationBlock: LocalizedString;
  audienceWhyItMattersBlock: LocalizedString;
  closingBlock?: LocalizedString;
};

export type Draft = {
  id: string;
  clusterId: string;
  draftType: "linkedin";
  /** Short working label (shown under the page title). */
  title: LocalizedString;
  generatedAt?: string;
  hook: LocalizedString;
  summaryBlock: LocalizedString;
  takeaways: [LocalizedString, LocalizedString, LocalizedString];
  careerInterpretationBlock: LocalizedString;
  audienceWhyItMattersBlock: LocalizedString;
  closingBlock?: LocalizedString;
  /** Additional content snapshots for local “regenerate” (2–3 total with primary). */
  variants?: LinkedInDraftContent[];
};
