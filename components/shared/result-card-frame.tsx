import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";

export type ResultCardVariant =
  | "digest"
  | "digestFeatured"
  | "digestMuted"
  | "archiveCluster"
  | "archiveArticle";

const variantClass: Record<ResultCardVariant, string> = {
  digest:
    "rounded-xl border bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer" +
    " [border-color:var(--sp-border)] hover:[border-color:var(--sp-accent-mid)]",
  digestFeatured:
    "rounded-xl border border-l-4 bg-white p-6 shadow-sm sm:p-8 transition-all duration-200 hover:shadow-lg" +
    " [border-color:var(--sp-border)] [border-left-color:var(--sp-accent-mid)]",
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

type ResultCardFrameProps = {
  variant: ResultCardVariant;
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "section";
} & Pick<HTMLAttributes<HTMLElement>, "aria-labelledby" | "id" | "role">;

export function ResultCardFrame({
  variant,
  children,
  className = "",
  as: Tag = "div",
  "aria-labelledby": ariaLabelledBy,
  id,
  role,
}: ResultCardFrameProps) {
  return (
    <Tag
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      className={`${variantClass[variant]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
