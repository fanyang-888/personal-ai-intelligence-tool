"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import {
  TOPIC_GROUPS,
  TRENDING_LABEL,
  topicGroupLabel,
} from "@/lib/constants/topic-groups";
import { archiveTopicHref } from "@/lib/utils/archive-url";

const itemStyle: CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  textDecoration: "none",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

type CategoryBarProps = {
  /** Optional last scrolling item (e.g. the mobile "view all" link). */
  trailing?: ReactNode;
};

/**
 * CNN-style horizontal category bar for the homepage top-clusters section.
 * "Trending" is the active item (today's top stories below); the topic
 * groups deep-link into the archive pre-filtered by that group.
 */
export function CategoryBar({ trailing }: CategoryBarProps) {
  const { t, lang } = useI18n();

  return (
    <nav
      aria-label={t.home.categoryBarAria}
      className="mb-3 flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <Link
        href="/"
        aria-current="page"
        className="pb-2"
        style={{
          ...itemStyle,
          color: "var(--accent)",
          borderBottom: "2px solid var(--accent)",
          marginBottom: -1,
        }}
      >
        {lang === "zh" ? TRENDING_LABEL.zh : TRENDING_LABEL.en}
      </Link>
      {TOPIC_GROUPS.map((g) => (
        <Link
          key={g.key}
          href={archiveTopicHref(g.key)}
          className="pb-2 transition-colors [color:var(--text-muted)] hover:[color:var(--accent)]"
          style={itemStyle}
        >
          {topicGroupLabel(g, lang)}
        </Link>
      ))}
      {trailing ? (
        <span className="ml-auto pb-2 pl-2" style={{ flexShrink: 0 }}>
          {trailing}
        </span>
      ) : null}
    </nav>
  );
}
