"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { ResultCardFrame } from "@/components/shared/result-card-frame";
import { useI18n } from "@/lib/i18n";
import { uiButtonPrimary } from "@/lib/ui/classes";

/** Bottom-of-home CTA: no duplicate search field (keyword search lives in the top nav). */
export function DiscoverArchiveCta() {
  const { t } = useI18n();

  return (
    <ResultCardFrame
      as="section"
      variant="digest"
      className="p-5 sm:p-6"
      aria-labelledby="discover-archive-heading"
    >
      <SectionTitle id="discover-archive-heading">
        {t.discover.title}
      </SectionTitle>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        {t.discover.bodyBeforeEmphasis}
        <span className="font-medium text-foreground">{t.discover.bodyEmphasis}</span>
        {t.discover.bodyAfterEmphasis}
      </p>
      <Link href="/archive" className={`mt-5 inline-block ${uiButtonPrimary}`}>
        {t.discover.cta}
      </Link>
    </ResultCardFrame>
  );
}
