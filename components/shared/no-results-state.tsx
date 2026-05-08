import type { ReactNode } from "react";

type NoResultsStateProps = {
  title: string;
  message?: string;
  children?: ReactNode;
};

/**
 * Filter/search produced no matches — solid panel, distinct from empty catalog (dashed) and 404.
 */
export function NoResultsState({
  title,
  message,
  children,
}: NoResultsStateProps) {
  return (
    <div className="rounded-lg border px-4 py-8 text-center shadow-sm [border-color:var(--border)] [background:var(--surface2)]">
      <p className="font-medium text-foreground">{title}</p>
      {message ? (
        <p className="mt-2 text-sm leading-relaxed [color:var(--text-muted)]">{message}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
