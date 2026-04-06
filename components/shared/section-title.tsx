import type { ReactNode } from "react";
import { uiSectionTitle } from "@/lib/ui/classes";

type SectionTitleProps = {
  children: ReactNode;
  id?: string;
};

export function SectionTitle({ children, id }: SectionTitleProps) {
  return (
    <h2 id={id} className={uiSectionTitle}>
      {children}
    </h2>
  );
}
