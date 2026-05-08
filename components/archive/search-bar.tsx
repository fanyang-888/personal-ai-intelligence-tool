"use client";

import { SearchBar as SharedSearchBar } from "@/components/shared/search-bar";

const HERO_INPUT_CLASS =
  "rounded-xl [border-color:var(--border)] px-4 py-3.5 text-base shadow-sm placeholder:[color:var(--text-muted)] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/25";

type ArchiveSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  id = "archive-search",
  label,
  placeholder,
}: ArchiveSearchBarProps) {
  return (
    <div className="mb-8">
      <SharedSearchBar
        value={value}
        onChange={onChange}
        id={id}
        label={label ?? "Search"}
        placeholder={placeholder}
        className="mb-0"
        labelClassName="text-xs font-normal uppercase tracking-wider [color:var(--text-muted)]"
        inputClassName={HERO_INPUT_CLASS}
      />
    </div>
  );
}
