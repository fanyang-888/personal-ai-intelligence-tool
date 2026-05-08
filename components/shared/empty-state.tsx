import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function EmptyState({ title, description, action, children }: EmptyStateProps) {
  return (
    <div className="rounded border border-dashed px-4 py-8 text-center [border-color:var(--border)] [background:var(--surface2)]">
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="mt-2 text-sm [color:var(--text-muted)]">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
