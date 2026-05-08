"use client";

import { BilingualAssistBody } from "@/components/shared/bilingual-assist-text";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import type { AudienceBlocks } from "@/types/cluster";
import type { LocalizedString } from "@/types/localized";

type WhyItMattersSectionProps = {
  overview: LocalizedString;
  audience: AudienceBlocks;
};

export function WhyItMattersSection({
  overview,
  audience,
}: WhyItMattersSectionProps) {
  const { t, lang } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.whyItMatters}</SectionTitle>
      <div className="text-sm leading-relaxed text-foreground">
        <BilingualAssistBody value={overview} lang={lang} />
      </div>
      <div className="mt-5 space-y-4 border-t [border-color:var(--border)] pt-5 text-sm leading-relaxed text-foreground">
        <div>
          <h3 className="font-semibold text-foreground">{t.cluster.audiencePm}</h3>
          <div className="mt-1 [color:var(--text-muted)]">
            <BilingualAssistBody
              value={audience.pm}
              lang={lang}
              className="space-y-2 text-sm leading-relaxed [color:var(--text-muted)]"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {t.cluster.audienceDeveloper}
          </h3>
          <div className="mt-1 [color:var(--text-muted)]">
            <BilingualAssistBody
              value={audience.developer}
              lang={lang}
              className="space-y-2 text-sm leading-relaxed [color:var(--text-muted)]"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {t.cluster.audienceStudent}
          </h3>
          <div className="mt-1 [color:var(--text-muted)]">
            <BilingualAssistBody
              value={audience.studentJobSeeker}
              lang={lang}
              className="space-y-2 text-sm leading-relaxed [color:var(--text-muted)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
