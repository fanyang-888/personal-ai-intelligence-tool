import type { ReactNode } from "react";
import type { HTMLAttributes } from "react";

export type ResultCardVariant =
  | "digest"
  | "digestFeatured"
  | "digestMuted"
  | "archiveCluster"
  | "archiveArticle";

const variantClass: Record<ResultCardVariant, string> = {
  digest: "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm",
  digestFeatured:
    "rounded-lg border border-zinc-200 border-l-4 border-l-emerald-600 bg-white p-6 shadow-sm sm:p-8",
  digestMuted: "rounded-lg border border-zinc-200 bg-zinc-50/50 shadow-sm",
  archiveCluster: "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm",
  archiveArticle:
    "rounded-md border border-zinc-200 bg-zinc-50/50 py-3 pl-4 pr-3 border-l-[3px] border-l-emerald-600/35",
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
