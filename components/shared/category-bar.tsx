"use client";

import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import {
  TOPIC_GROUPS,
  TRENDING_LABEL,
  topicGroupLabel,
  type TopicGroupKey,
} from "@/lib/constants/topic-groups";

export type CategoryKey = "trending" | TopicGroupKey;

// No border shorthand here — active/inactive only swap borderBottomColor,
// so every border property stays longhand (React warns on mixing them).
const itemStyle: CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  flexShrink: 0,
  background: "none",
  borderTopStyle: "none",
  borderLeftStyle: "none",
  borderRightStyle: "none",
  borderBottomWidth: 2,
  borderBottomStyle: "solid",
  borderBottomColor: "transparent",
  marginBottom: -1,
  cursor: "pointer",
  padding: 0,
};

type CategoryBarProps = {
  active: CategoryKey;
  onSelect: (key: CategoryKey) => void;
  /** Optional last scrolling item (e.g. the mobile "view all" link). */
  trailing?: ReactNode;
};

/**
 * CNN-style horizontal category bar for the homepage top-clusters section.
 * Tabs switch the story list in place: "Trending" shows today's top stories,
 * a topic group shows that group's most recent stories from the archive.
 */
export function CategoryBar({ active, onSelect, trailing }: CategoryBarProps) {
  const { t, lang } = useI18n();

  const items: { key: CategoryKey; label: string }[] = [
    { key: "trending", label: lang === "zh" ? TRENDING_LABEL.zh : TRENDING_LABEL.en },
    ...TOPIC_GROUPS.map((g) => ({ key: g.key as CategoryKey, label: topicGroupLabel(g, lang) })),
  ];

  return (
    <nav
      aria-label={t.home.categoryBarAria}
      className="mb-3 flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {items.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(key)}
            className={
              isActive
                ? "pb-2"
                : "pb-2 transition-colors [color:var(--text-muted)] hover:[color:var(--accent)]"
            }
            style={
              isActive
                ? {
                    ...itemStyle,
                    color: "var(--accent)",
                    borderBottomColor: "var(--accent)",
                  }
                : itemStyle
            }
          >
            {label}
          </button>
        );
      })}
      {trailing ? (
        <span className="ml-auto pb-2 pl-2" style={{ flexShrink: 0 }}>
          {trailing}
        </span>
      ) : null}
    </nav>
  );
}
