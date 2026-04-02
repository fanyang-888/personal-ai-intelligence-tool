"use client";

type FilterBarProps = {
  theme: string;
  sourceId: string;
  themes: string[];
  sources: { id: string; name: string }[];
  onThemeChange: (theme: string) => void;
  onSourceChange: (sourceId: string) => void;
};

export function FilterBar({
  theme,
  sourceId,
  themes,
  sources,
  onThemeChange,
  onSourceChange,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
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
      <div className="flex-1">
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
    </div>
  );
}
