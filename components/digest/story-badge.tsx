import type { ReactNode } from "react";

export type StoryBadgeVariant = "status" | "metric" | "tag";

/** Color map for raw storyStatus keys from the backend. */
const statusKeyClass: Record<string, string> = {
  new:        "border-emerald-300/60 bg-emerald-50 text-emerald-800",
  escalating: "border-amber-300/60  bg-amber-50  text-amber-800",
  peaking:    "border-rose-300/60   bg-rose-50   text-rose-800",
  ongoing:    "border-blue-300/60   bg-blue-50   text-blue-800",
  fading:     "border-zinc-200      bg-zinc-50   text-zinc-500",
};

const variantClass: Record<StoryBadgeVariant, string> = {
  status: "border-emerald-600/25 bg-emerald-50/60 text-zinc-800",
  metric: "border-zinc-200 bg-zinc-100 text-zinc-600",
  tag:    "border-zinc-200 bg-zinc-50  text-zinc-600",
};

type StoryBadgeProps = {
  children: ReactNode;
  variant?: StoryBadgeVariant;
  /** Raw cluster.storyStatus key — enables color-coded status badges. */
  statusKey?: string;
  className?: string;
};

export function StoryBadge({
  children,
  variant = "tag",
  statusKey,
  className = "",
}: StoryBadgeProps) {
  const colorClass =
    variant === "status" && statusKey
      ? (statusKeyClass[statusKey] ?? variantClass.status)
      : variantClass[variant];

  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
}
