"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function SearchBar({ value, onChange, id = "archive-search" }: SearchBarProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        Search
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Keyword in title or summary…"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-foreground"
      />
    </div>
  );
}
