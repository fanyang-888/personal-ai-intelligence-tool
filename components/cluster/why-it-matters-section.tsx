"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import type { AudienceBlocks } from "@/types/cluster";

type WhyItMattersSectionProps = {
  overview: string;
  audience: AudienceBlocks;
};

export function WhyItMattersSection({
  overview,
  audience,
}: WhyItMattersSectionProps) {
  const { t } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.whyItMatters}</SectionTitle>
      <p className="text-sm leading-relaxed text-foreground">{overview}</p>
      <div className="mt-5 space-y-4 border-t border-zinc-100 pt-5 text-sm leading-relaxed text-foreground">
        <div>
          <h3 className="font-semibold text-foreground">{t.cluster.audiencePm}</h3>
          <p className="mt-1 text-zinc-700">{audience.pm}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {t.cluster.audienceDeveloper}
          </h3>
          <p className="mt-1 text-zinc-700">{audience.developer}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {t.cluster.audienceStudent}
          </h3>
          <p className="mt-1 text-zinc-700">{audience.studentJobSeeker}</p>
        </div>
      </div>
    </section>
  );
}
