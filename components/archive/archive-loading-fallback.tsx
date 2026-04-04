"use client";

import { useI18n } from "@/lib/i18n";

export function ArchiveLoadingFallback() {
  const { t } = useI18n();

  return (
    <div className="text-sm text-zinc-500" aria-live="polite">
      {t.archive.loading}
    </div>
  );
}
