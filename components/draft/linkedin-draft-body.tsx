import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import type { LinkedInDraftContent } from "@/types/draft";

type LinkedInDraftBodyProps = {
  content: LinkedInDraftContent;
};

export function LinkedInDraftBody({ content }: LinkedInDraftBodyProps) {
  const { t } = useI18n();
  const summaryParagraphs = content.summaryBlock
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {t.draft.sectionHook}
        </p>
        <p className="mt-2 text-lg font-medium leading-snug text-foreground">
          {content.hook}
        </p>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionSummary}</SectionTitle>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
          {summaryParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.takeawaysIntro}</SectionTitle>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
          {content.takeaways.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionCareerAngle}</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {content.careerInterpretationBlock}
        </p>
      </section>

      <section className="mb-8">
        <SectionTitle>{t.draft.sectionWhyItMatters}</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {content.audienceWhyItMattersBlock}
        </p>
      </section>

      {content.closingBlock?.trim() ? (
        <section>
          <SectionTitle>{t.draft.sectionClosing}</SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {content.closingBlock}
          </p>
        </section>
      ) : null}
    </div>
  );
}
