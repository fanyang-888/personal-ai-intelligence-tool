"use client";

import {
  BilingualAssistBody,
  BilingualAssistLead,
  BilingualAssistTakeawayItem,
} from "@/components/shared/bilingual-assist-text";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import type { LinkedInDraftContent } from "@/types/draft";

type LinkedInDraftBodyProps = {
  content: LinkedInDraftContent;
  /** Same string appended to copied full draft (hashtag tokens). */
  hashtagLine?: string;
};

export function LinkedInDraftBody({ content, hashtagLine }: LinkedInDraftBodyProps) {
  const { t, lang } = useI18n();

  const closingText =
    content.closingBlock != null
      ? pickLocalized(content.closingBlock, lang).trim()
      : "";

  return (
    <div className="rounded-lg border p-5 shadow-sm sm:p-6 [border-color:var(--border)] [background:var(--surface)]">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide [color:var(--text-muted)]">
          {t.draft.sectionHook}
        </p>
        <div className="mt-2">
          <BilingualAssistLead value={content.hook} lang={lang} />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionSummary}</SectionTitle>
        <div className="mt-3">
          <BilingualAssistBody value={content.summaryBlock} lang={lang} />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.takeawaysIntro}</SectionTitle>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground">
          {content.takeaways.map((item, i) => (
            <li key={i}>
              <BilingualAssistTakeawayItem value={item} lang={lang} />
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionCareerAngle}</SectionTitle>
        <div className="mt-3">
          <BilingualAssistBody
            value={content.careerInterpretationBlock}
            lang={lang}
          />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionWhyItMatters}</SectionTitle>
        <div className="mt-3">
          <BilingualAssistBody
            value={content.audienceWhyItMattersBlock}
            lang={lang}
          />
        </div>
      </section>

      {closingText ? (
        <section>
          <SectionTitle>{t.draft.sectionClosing}</SectionTitle>
          <div className="mt-3">
            <BilingualAssistBody
              value={content.closingBlock!}
              lang={lang}
            />
          </div>
        </section>
      ) : null}

      {hashtagLine ? (
        <section className="mt-8 border-t pt-6 [border-color:var(--border)]">
          <p className="text-xs font-semibold uppercase tracking-wide [color:var(--text-muted)]">
            {t.draft.suggestedHashtags}
          </p>
          <p className="mt-2 text-sm leading-relaxed [color:var(--text)]">{hashtagLine}</p>
        </section>
      ) : null}
    </div>
  );
}
