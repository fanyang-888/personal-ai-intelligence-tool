import type { ReactNode } from "react";
import {
  uiPageDescription,
  uiPageDescriptionCompact,
  uiPageMetaLine,
  uiPageTitle,
  uiPageTitleHome,
} from "@/lib/ui/classes";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Extra line under description (e.g. digest date). */
  meta?: ReactNode;
  /** Additional content inside the header (rare). */
  children?: ReactNode;
  variant?: "default" | "home";
  /** Bottom border under the header block (digest landing). */
  bordered?: boolean;
  /** Use slightly tighter description typography (archive-style). */
  descriptionCompact?: boolean;
};

export function PageHeader({
  title,
  description,
  meta,
  children,
  variant = "default",
  bordered = false,
  descriptionCompact = false,
}: PageHeaderProps) {
  const titleClass = variant === "home" ? uiPageTitleHome : uiPageTitle;
  const descClass = descriptionCompact
    ? uiPageDescriptionCompact
    : uiPageDescription;
  const marginClass = variant === "home" ? "mb-10" : "mb-8";
  const borderClass = bordered ? "border-b border-zinc-100 pb-8" : "";

  return (
    <header className={`${borderClass} ${marginClass}`.trim()}>
      <h1 className={titleClass}>{title}</h1>
      {description ? <p className={descClass}>{description}</p> : null}
      {meta ? <p className={uiPageMetaLine}>{meta}</p> : null}
      {children}
    </header>
  );
}
