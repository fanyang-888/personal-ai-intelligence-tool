"use client";

import {
  SOURCE_CHANNEL_LABEL,
  SOURCE_CHANNELS_ALL,
} from "@/lib/utils/cluster-sources";

type FilterBarProps = {
  theme: string;
  sourceId: string;
  channel: string;
  themes: string[];
  sources: { id: string; name: string }[];
  onThemeChange: (theme: string) => void;
  onSourceChange: (sourceId: string) => void;
  onChannelChange: (channel: string) => void;
};

export function FilterBar({
  theme,
  sourceId,
  channel,
  themes,
  sources,
  onThemeChange,
  onSourceChange,
  onChannelChange,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
        <label htmlFor="filter-theme" className="mb-1 block text-sm font-medium">
          Theme
        </label>
        <select
          id="filter-theme"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All themes</option>
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
        <label htmlFor="filter-source" className="mb-1 block text-sm font-medium">
          Source
        </label>
        <select
          id="filter-source"
          value={sourceId}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0 flex-1 lg:min-w-[10rem]">
        <label htmlFor="filter-channel" className="mb-1 block text-sm font-medium">
          Channel
        </label>
        <select
          id="filter-channel"
          value={channel}
          onChange={(e) => onChannelChange(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All channels</option>
          {SOURCE_CHANNELS_ALL.map((ch) => (
            <option key={ch} value={ch}>
              {SOURCE_CHANNEL_LABEL[ch]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
