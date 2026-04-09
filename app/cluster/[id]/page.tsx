// Server component — owns generateStaticParams (required for output: export).
// All interactive logic lives in ClusterPageClient ("use client").

import { ClusterPageClient } from "./cluster-page-client";

export function generateStaticParams() {
  return [];
}

export default function ClusterPage() {
  return <ClusterPageClient />;
}
