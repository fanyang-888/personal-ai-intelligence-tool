import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block rounded border border-zinc-300 px-2 py-0.5 text-xs text-foreground">
      {children}
    </span>
  );
}
