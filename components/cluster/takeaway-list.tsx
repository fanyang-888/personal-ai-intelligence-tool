"use client";

import { BilingualAssistTakeawayItem } from "@/components/shared/bilingual-assist-text";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";
import type { LocalizedString } from "@/types/localized";

type TakeawayListProps = {
  items: LocalizedString[];
};

export function TakeawayList({ items }: TakeawayListProps) {
  const { t, lang } = useI18n();

  return (
    <section className="mb-6">
      <SectionTitle>{t.cluster.takeaways}</SectionTitle>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
        {items.map((item, i) => (
          <li key={i}>
            <BilingualAssistTakeawayItem value={item} lang={lang} />
          </li>
        ))}
      </ol>
    </section>
  );
}
