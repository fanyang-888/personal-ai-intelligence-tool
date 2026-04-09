// Server component — owns generateStaticParams (required for output: export).
// All interactive logic lives in DraftPageClient ("use client").

import { DraftPageClient } from "./draft-page-client";

export function generateStaticParams() {
  return [];
}

export default function DraftPage() {
  return <DraftPageClient />;
}
