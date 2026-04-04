"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

type TakeawayListProps = {
  items: string[];
};

export function TakeawayList({ items }: TakeawayListProps) {
  const { t } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.takeaways}</SectionTitle>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
