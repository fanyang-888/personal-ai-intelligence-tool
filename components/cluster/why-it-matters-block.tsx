"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

type WhyItMattersBlockProps = {
  text: string;
};

export function WhyItMattersBlock({ text }: WhyItMattersBlockProps) {
  const { t } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.whyItMatters}</SectionTitle>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </section>
  );
}
