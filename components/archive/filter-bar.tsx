"use client";

import { useI18n } from "@/lib/i18n";
import { TOPIC_GROUPS, topicGroupLabel } from "@/lib/constants/topic-groups";

type FilterBarProps = {
  topic: string;
  onTopicChange: (topic: string) => void;
};

function FilterBar({ topic, onTopicChange }: FilterBarProps) {
  const { t, lang } = useI18n();

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="min-w-0 flex-1 lg:min-w-[10rem] lg:max-w-xs">
        <label htmlFor="filter-category" className="mb-1 block text-sm font-medium">
          {t.archive.filterCategory}
        </label>
        <select
          id="filter-category"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full rounded border [border-color:var(--border)] px-3 py-2 text-sm"
        >
          <option value="">{t.archive.allCategories}</option>
          {TOPIC_GROUPS.map((g) => (
            <option key={g.key} value={g.key}>
              {topicGroupLabel(g, lang)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { FilterBar, FilterBar as FilterRow };
