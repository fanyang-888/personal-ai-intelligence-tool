"use client";

import { useI18n } from "@/lib/i18n";
import { TOPIC_GROUPS, topicGroupLabel } from "@/lib/constants/topic-groups";

type ArchiveToolbarProps = {
  topic: string;
  onTopicChange: (topicKey: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
};

/** Sticky filter row: category pills + compact search (timeline archive design). */
export function ArchiveToolbar({
  topic,
  onTopicChange,
  keyword,
  onKeywordChange,
}: ArchiveToolbarProps) {
  const { t, lang } = useI18n();

  const pillClass = (on: boolean) =>
    [
      "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
      on
        ? "border-transparent font-semibold [background:var(--accent)] [color:var(--bg)]"
        : "[border-color:var(--border)] [background:var(--surface)] [color:var(--text-muted)] hover:[border-color:var(--accent)] hover:[color:var(--accent)]",
    ].join(" ");

  return (
    <div
      className="sticky top-14 z-30 mb-2 flex flex-wrap items-center gap-2 border-b py-3 [background:var(--bg)] [border-color:var(--border)]"
      role="toolbar"
      aria-label={t.archive.filterCategory}
    >
      <button type="button" className={pillClass(topic === "")} onClick={() => onTopicChange("")}>
        {t.archive.allCategories}
      </button>
      {TOPIC_GROUPS.map((g) => (
        <button
          key={g.key}
          type="button"
          className={pillClass(topic === g.key)}
          onClick={() => onTopicChange(g.key)}
        >
          {topicGroupLabel(g, lang)}
        </button>
      ))}
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder={t.archive.searchPlaceholder}
        aria-label={t.archive.searchLabel}
        className="ml-auto h-8 w-full rounded-full border px-3.5 text-xs text-foreground outline-none [background:var(--surface)] [border-color:var(--border)] focus:[border-color:var(--accent)] sm:w-[240px] sm:max-w-[240px]"
      />
    </div>
  );
}
