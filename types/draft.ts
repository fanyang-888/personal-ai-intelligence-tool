/** Blocks for one LinkedIn-style draft snapshot (primary or a mock variant). */
export type LinkedInDraftContent = {
  hook: string;
  summaryBlock: string;
  takeaways: [string, string, string];
  careerInterpretationBlock: string;
  audienceWhyItMattersBlock: string;
  closingBlock?: string;
};

export type Draft = {
  id: string;
  clusterId: string;
  draftType: "linkedin";
  /** Short working label (shown under the page title). */
  title: string;
  generatedAt?: string;
  hook: string;
  summaryBlock: string;
  takeaways: [string, string, string];
  careerInterpretationBlock: string;
  audienceWhyItMattersBlock: string;
  closingBlock?: string;
  /** Additional content snapshots for local “regenerate” (2–3 total with primary). */
  variants?: LinkedInDraftContent[];
};
