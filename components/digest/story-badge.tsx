import type { ReactNode } from "react";

export type StoryBadgeVariant = "status" | "metric" | "tag";

/** Neutral pills; only status gets a hint of accent so CTAs stay visually distinct. */
const variantClass: Record<StoryBadgeVariant, string> = {
  status:
    "border border-emerald-600/25 bg-emerald-50/60 text-zinc-800",
  metric: "border border-zinc-200 bg-zinc-100 text-zinc-600",
  tag: "border border-zinc-200 bg-zinc-50 text-zinc-600",
};

type StoryBadgeProps = {
  children: ReactNode;
  variant?: StoryBadgeVariant;
  className?: string;
};

export function StoryBadge({
  children,
  variant = "tag",
  className = "",
}: StoryBadgeProps) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${variantClass[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
