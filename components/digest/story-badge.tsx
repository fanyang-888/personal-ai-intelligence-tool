import type { ReactNode } from "react";

export type StoryBadgeVariant = "status" | "metric" | "tag";

const variantClass: Record<StoryBadgeVariant, string> = {
  status:
    "border-emerald-600/40 bg-emerald-50 text-emerald-900",
  metric:
    "border-zinc-200 bg-zinc-50 text-zinc-600",
  tag:
    "border-emerald-200 bg-white text-emerald-800",
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
