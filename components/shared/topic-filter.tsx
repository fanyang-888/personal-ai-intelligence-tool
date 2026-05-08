"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sipply-topics";

type TopicFilterProps = {
  /** All available tags from today's clusters */
  tags: string[];
  /** Called when selection changes; empty array = show all */
  onChange: (selected: string[]) => void;
};

export function TopicFilter({ tags, onChange }: TopicFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  // Load persisted preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        setSelected(parsed);
        onChange(parsed);
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(
    (tag: string) => {
      setSelected((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        onChange(next);
        return next;
      });
    },
    [onChange],
  );

  const clearAll = useCallback(() => {
    setSelected([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    onChange([]);
  }, [onChange]);

  if (tags.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium [color:var(--text-muted)]">Filter:</span>
      {tags.slice(0, 12).map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className={[
            "rounded-full border px-3 py-0.5 text-xs transition-colors",
            selected.includes(tag)
              ? "border-transparent font-medium [background:var(--accent)] [color:var(--bg)]"
              : "[border-color:var(--border)] [color:var(--text-muted)] hover:[border-color:var(--accent)] hover:[color:var(--accent)]",
          ].join(" ")}
        >
          {tag}
        </button>
      ))}
      {selected.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs [color:var(--text-muted)] hover:[color:var(--accent)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}
