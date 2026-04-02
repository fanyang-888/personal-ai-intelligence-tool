import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-2 text-lg font-semibold text-foreground">{children}</h2>;
}
