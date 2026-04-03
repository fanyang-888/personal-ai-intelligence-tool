import { Suspense } from "react";
import { ArchivePageClient } from "@/app/archive/archive-page-client";

export default function ArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-zinc-500" aria-live="polite">
          Loading archive…
        </div>
      }
    >
      <ArchivePageClient />
    </Suspense>
  );
}
