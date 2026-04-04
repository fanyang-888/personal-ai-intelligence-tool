"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import type { AudienceBlocks } from "@/types/cluster";

type AudienceBlocksProps = {
  audience: AudienceBlocks;
};

export function AudienceBlocksSection({ audience }: AudienceBlocksProps) {
  const { t } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.whyItMattersForYou}</SectionTitle>
      <div className="space-y-4 text-sm leading-relaxed text-foreground">
        <div>
          <h3 className="font-semibold">{t.cluster.audiencePm}</h3>
          <p className="mt-1 text-zinc-700">{audience.pm}</p>
        </div>
        <div>
          <h3 className="font-semibold">{t.cluster.audienceDeveloper}</h3>
          <p className="mt-1 text-zinc-700">{audience.developer}</p>
        </div>
        <div>
          <h3 className="font-semibold">{t.cluster.audienceStudent}</h3>
          <p className="mt-1 text-zinc-700">{audience.studentJobSeeker}</p>
        </div>
      </div>
    </section>
  );
}
