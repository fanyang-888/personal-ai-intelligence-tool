import type { ReactNode } from "react";

/** Neutral pill aligned with digest StoryBadge “tag” styling. */
type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
      {children}
    </span>
  );
}
