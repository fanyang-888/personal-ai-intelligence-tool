/** Where the signal was captured (mock-only; neutral icons in UI, no brand logos). */
export type SourceChannel = "email" | "chat" | "web" | "feed";

export type Source = {
  id: string;
  name: string;
  url: string;
  publisher?: string;
  /** Optional ingest channel for digest transparency */
  channel?: SourceChannel;
};
