"use client";

import { Fragment, type ReactNode } from "react";

const DEFAULT_MARK =
  "rounded-sm px-0.5 font-semibold text-foreground [background:color-mix(in_srgb,var(--accent)_20%,transparent)]";

type HighlightMatchProps = {
  text: string;
  query: string;
  markClassName?: string;
};

/** Case-insensitive substring highlights for archive snippets (plain text only). */
export function HighlightMatch({
  text,
  query,
  markClassName = DEFAULT_MARK,
}: HighlightMatchProps) {
  const q = query.trim();
  if (!q) {
    return text;
  }

  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();
  const nodes: ReactNode[] = [];
  let start = 0;
  let key = 0;
  let idx = lower.indexOf(qLower, start);

  while (idx !== -1) {
    if (idx > start) {
      nodes.push(<Fragment key={`t-${key++}`}>{text.slice(start, idx)}</Fragment>);
    }
    const end = idx + q.length;
    nodes.push(
      <mark key={`m-${key++}`} className={markClassName}>
        {text.slice(idx, end)}
      </mark>,
    );
    start = end;
    idx = lower.indexOf(qLower, start);
  }

  if (start < text.length) {
    nodes.push(<Fragment key={`t-${key++}`}>{text.slice(start)}</Fragment>);
  }

  if (nodes.length === 0) {
    return text;
  }

  return <>{nodes}</>;
}
