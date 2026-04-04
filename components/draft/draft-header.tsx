"use client";

import { useI18n } from "@/lib/i18n";
import { formatShortDateTime } from "@/lib/utils/format-date";
import type { Draft } from "@/types/draft";

type DraftHeaderProps = {
  draft: Draft;
  isDraftOfDay: boolean;
  storyTitle: string;
};

export function DraftHeader({
  draft,
  isDraftOfDay,
  storyTitle,
}: DraftHeaderProps) {
  const { t, lang } = useI18n();

  const pageTitle = isDraftOfDay
    ? t.draft.draftOfDayPageTitle
    : t.draft.draftForStoryPageTitle(storyTitle);

  return (
    <header className="mb-8 border-b border-zinc-100 pb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        {pageTitle}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        <span className="font-medium text-zinc-500">{t.draft.workingTitleLabel}: </span>
        {draft.title}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
          {t.draft.linkedInDraftType}
        </span>
        {draft.generatedAt ? (
          <span className="text-xs text-zinc-500">
            {t.draft.generatedPrefix}{" "}
            {formatShortDateTime(draft.generatedAt, lang)}
          </span>
        ) : null}
      </div>
    </header>
  );
}
