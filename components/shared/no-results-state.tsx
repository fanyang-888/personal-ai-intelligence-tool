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
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/90 px-4 py-8 text-center shadow-sm">
      <p className="font-medium text-foreground">{title}</p>
      {message ? (
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{message}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
