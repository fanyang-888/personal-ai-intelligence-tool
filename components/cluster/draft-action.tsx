"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

type DraftVariant = "prominent" | "compact" | "default";

type DraftActionProps = {
  draftId: string | undefined;
  variant?: DraftVariant;
  className?: string;
};

export function DraftAction({
  draftId,
  variant = "default",
  className = "",
}: DraftActionProps) {
  const { t } = useI18n();

  if (variant === "prominent") {
    return (
      <section
        className={`rounded-lg border border-zinc-200 border-l-4 border-l-emerald-600 bg-emerald-50/40 p-4 shadow-sm sm:p-5 ${className}`}
        aria-labelledby="cluster-draft-prominent-heading"
      >
        <h2
          id="cluster-draft-prominent-heading"
          className="text-base font-semibold text-foreground"
        >
          {t.cluster.draftSectionTitle}
        </h2>
        {draftId ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {t.cluster.draftProminentLead}
            </p>
            <Link
              href={`/draft/${draftId}`}
              className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-600/50 underline-offset-4 hover:text-emerald-950"
            >
              {t.cluster.openDraft}
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">{t.cluster.noDraftLinked}</p>
        )}
      </section>
    );
  }

  if (variant === "compact") {
    if (!draftId) return null;
    return (
      <section
        className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-sm ${className}`}
        aria-labelledby="cluster-draft-compact-heading"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="cluster-draft-compact-heading"
            className="text-sm font-semibold text-foreground"
          >
            {t.cluster.draftSectionTitle}
          </h2>
          <span
            className="rounded border border-emerald-200 bg-emerald-50/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900"
            title={t.cluster.draftCompactLead}
          >
            {t.cluster.draftStickyBadge}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-600">{t.cluster.draftCompactLead}</p>
        <Link
          href={`/draft/${draftId}`}
          className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
        >
          {t.cluster.openDraft}
        </Link>
      </section>
    );
  }

  return (
    <section className={`rounded border border-zinc-200 p-4 ${className}`}>
      <SectionTitle>{t.cluster.draftSectionTitle}</SectionTitle>
      {draftId ? (
        <>
          <p className="mb-3 text-sm text-zinc-600">{t.cluster.draftSectionLead}</p>
          <Link
            href={`/draft/${draftId}`}
            className="text-sm font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
          >
            {t.cluster.openDraft}
          </Link>
        </>
      ) : (
        <p className="text-sm text-zinc-600">{t.cluster.noDraftLinked}</p>
      )}
    </section>
  );
}
