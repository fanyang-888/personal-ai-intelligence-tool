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
    "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
  digestFeatured:
    "rounded-lg border border-emerald-200 border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-8 transition-all duration-200 hover:shadow-lg",
  digestMuted:
    "rounded-lg border border-zinc-200 bg-zinc-50/50 shadow-sm transition-colors duration-150 hover:bg-white hover:border-zinc-300",
  archiveCluster:
    "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
  archiveArticle:
    "rounded-md border border-zinc-200 bg-zinc-50/50 py-3 pl-4 pr-3 border-l-[3px] border-l-emerald-600/35 transition-colors duration-150 hover:bg-white hover:border-zinc-300",
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
