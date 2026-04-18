"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import { formatShortDateTime } from "@/lib/utils/format-date";
import type { Article } from "@/types/article";

type CoveredSourcesListProps = {
  articles: Article[];
};

export function CoveredSourcesList({ articles }: CoveredSourcesListProps) {
  const { t, lang } = useI18n();

  if (articles.length === 0) {
    return (
      <section className="mb-6">
        <SectionTitle>{t.cluster.coveredSources}</SectionTitle>
        <p className="text-sm text-zinc-600">{t.cluster.emptyCoveredSources}</p>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.coveredSources}</SectionTitle>
      <p className="mb-3 text-xs leading-relaxed text-zinc-500">
        {t.cluster.sourceOriginalPreservedNote}
      </p>
      <ul className="space-y-4 text-sm">
        {articles.map((art) => {
          const outlet = (art as { organizationName?: string }).organizationName ?? "—";
          const published = formatShortDateTime(art.publishedAt, lang);

          return (
            <li
              key={art.id}
              className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {outlet}
              </p>
              <a
                href={art.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-medium text-foreground underline underline-offset-4"
              >
                {art.title}
              </a>
              <p className="mt-2 leading-relaxed text-zinc-700">{art.excerpt}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span>{published}</span>
                {art.credibilityLabel ? (
                  <span>
                    {t.cluster.credibilityPrefix} {art.credibilityLabel}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
