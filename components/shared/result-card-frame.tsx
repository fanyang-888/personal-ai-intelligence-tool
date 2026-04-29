import type { CSSProperties, ReactNode } from "react";
import type { HTMLAttributes } from "react";

export type ResultCardVariant =
  | "digest"
  | "digestFeatured"
  | "digestMuted"
  | "archiveCluster"
  | "archiveArticle";

const variantClass: Record<ResultCardVariant, string> = {
  digest:
    "rounded-xl border border-l-[3px] bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer" +
    " [border-color:var(--sp-border)]",
  digestFeatured:
    "rounded-xl border border-l-4 bg-white p-6 shadow-sm sm:p-8 transition-all duration-200 hover:shadow-lg" +
    " [border-color:var(--sp-border)]",
  digestMuted:
    "rounded-xl border bg-white/60 shadow-sm transition-colors duration-150 hover:bg-white" +
    " [border-color:var(--sp-border)]",
  archiveCluster:
    "rounded-xl border bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md" +
    " [border-color:var(--sp-border)] hover:[border-color:var(--sp-accent-mid)]",
  archiveArticle:
    "rounded-lg border border-l-[3px] bg-white/70 py-3 pl-4 pr-3 transition-colors duration-150 hover:bg-white" +
    " [border-color:var(--sp-border)] [border-left-color:var(--sp-accent-mid)]",
};

/** Maps storyStatus keys → left-border blue tones (darkest = peaking, lightest = fading). */
const statusBorderColor: Record<string, string> = {
  new:        "#5dc8f5", // bright light blue — fresh
  escalating: "#2e96cc", // vivid medium blue — growing
  peaking:    "#0d6fa0", // deep saturated blue — at peak
  ongoing:    "#4a9bbf", // steady mid blue
  fading:     "#8ab8ce", // muted pale blue — diminishing
};

function getLeftBorderColor(statusKey?: string): string {
  if (!statusKey) return "var(--sp-accent-mid)";
  return statusBorderColor[statusKey] ?? "var(--sp-accent-mid)";
}

type ResultCardFrameProps = {
  variant: ResultCardVariant;
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "section";
  /** Pass cluster.storyStatus to tint the left border by status (digest + digestFeatured only). */
  statusKey?: string;
} & Pick<HTMLAttributes<HTMLElement>, "aria-labelledby" | "id" | "role">;

export function ResultCardFrame({
  variant,
  children,
  className = "",
  as: Tag = "div",
  statusKey,
  "aria-labelledby": ariaLabelledBy,
  id,
  role,
}: ResultCardFrameProps) {
  const inlineStyle: CSSProperties =
    variant === "digest" || variant === "digestFeatured"
      ? { borderLeftColor: getLeftBorderColor(statusKey) }
      : {};

  return (
    <Tag
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      className={`${variantClass[variant]} ${className}`.trim()}
      style={inlineStyle}
    >
      {children}
    </Tag>
  );
}
