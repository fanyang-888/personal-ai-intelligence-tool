import { Suspense } from "react";
import { ArchivePageClient } from "@/app/archive/archive-page-client";
import { ArchiveLoadingFallback } from "@/components/archive/archive-loading-fallback";

export default function ArchivePage() {
  return (
    <Suspense fallback={<ArchiveLoadingFallback />}>
      <ArchivePageClient />
    </Suspense>
  );
}
