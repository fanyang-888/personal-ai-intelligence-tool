"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

/** Bottom-of-home CTA: no duplicate search field (keyword search lives in the top nav). */
export function DiscoverArchiveCta() {
  const { t } = useI18n();

  return (
    <section
      className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6"
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
      <Link
        href="/archive"
        className="mt-5 inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        {t.discover.cta}
      </Link>
    </section>
  );
}
