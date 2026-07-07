"use client";

import { useI18n } from "@/lib/i18n";
import { TOPIC_GROUPS, topicGroupLabel } from "@/lib/constants/topic-groups";
import { SOURCE_CHANNELS_ALL } from "@/lib/utils/cluster-sources";

type FilterBarProps = {
  topic: string;
  sourceId: string;
  channel: string;
  sources: { id: string; name: string }[];
  onTopicChange: (topic: string) => void;
  onSourceChange: (sourceId: string) => void;
  onChannelChange: (channel: string) => void;
};

function FilterBar({
  topic,
  sourceId,
  channel,
  sources,
  onTopicChange,
  onSourceChange,
  onChannelChange,
}: FilterBarProps) {
  const { t, lang } = useI18n();

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
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
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
        <label htmlFor="filter-source" className="mb-1 block text-sm font-medium">
          {t.archive.filterSource}
        </label>
        <select
          id="filter-source"
          value={sourceId}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full rounded border [border-color:var(--border)] px-3 py-2 text-sm"
        >
          <option value="">{t.archive.allSources}</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
        <label htmlFor="filter-channel" className="mb-1 block text-sm font-medium">
          {t.archive.filterChannel}
        </label>
        <select
          id="filter-channel"
          value={channel}
          onChange={(e) => onChannelChange(e.target.value)}
          className="w-full rounded border [border-color:var(--border)] px-3 py-2 text-sm"
        >
          <option value="">{t.archive.allChannels}</option>
          {SOURCE_CHANNELS_ALL.map((ch) => (
            <option key={ch} value={ch}>
              {t.channels[ch]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { FilterBar, FilterBar as FilterRow };
