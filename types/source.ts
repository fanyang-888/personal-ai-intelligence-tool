/** Where the signal was captured (mock-only; neutral icons in UI, no brand logos). */
export type SourceChannel = "email" | "chat" | "web" | "feed";

export type Source = {
  id: string;
  name: string;
  /** Example article or homepage URL for mock outbound links */
  url: string;
  publisher?: string;
  /** Optional ingest channel for digest transparency */
  channel?: SourceChannel;
  /** e.g. tech press, wire, academic */
  type?: string;
  baseUrl?: string;
  /** Mock priority / trust tier for internal ranking stories (display only) */
  sourcePrior?: number;
};
