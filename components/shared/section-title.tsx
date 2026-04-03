import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  id?: string;
};

export function SectionTitle({ children, id }: SectionTitleProps) {
  return (
    <h2 id={id} className="mb-2 text-lg font-semibold text-foreground">
      {children}
    </h2>
  );
}
