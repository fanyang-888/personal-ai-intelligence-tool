"use client";

import { BilingualAssistSubline } from "@/components/shared/bilingual-assist-text";
import { useI18n } from "@/lib/i18n";
import { uiPageTitle, uiMetaTextSm } from "@/lib/ui/classes";
import { pickLocalized } from "@/lib/utils/localized-string";
import { formatShortDateTime } from "@/lib/utils/format-date";
import type { Draft } from "@/types/draft";
import type { LocalizedString } from "@/types/localized";

type DraftHeaderProps = {
  draft: Draft;
  isDraftOfDay: boolean;
  storyTitle: LocalizedString;
};

export function DraftHeader({
  draft,
  isDraftOfDay,
  storyTitle,
}: DraftHeaderProps) {
  const { t, lang } = useI18n();

  const displayStoryTitle = pickLocalized(storyTitle, lang);
  const pageTitle = isDraftOfDay
    ? t.draft.draftOfDayPageTitle
    : t.draft.draftForStoryPageTitle(displayStoryTitle);

  return (
    <header className="mb-8 border-b [border-color:var(--border)] pb-8">
      <h1 className={uiPageTitle}>{pageTitle}</h1>
      <div className={`mt-2 ${uiMetaTextSm}`}>
        <span className="font-medium [color:var(--text-muted)]">{t.draft.workingTitleLabel}: </span>
        <BilingualAssistSubline value={draft.title} lang={lang} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
          {t.draft.linkedInDraftType}
        </span>
        {draft.generatedAt ? (
          <span className="text-xs [color:var(--text-muted)]">
            {t.draft.generatedPrefix}{" "}
            {formatShortDateTime(draft.generatedAt, lang)}
          </span>
        ) : null}
      </div>
    </header>
  );
}
