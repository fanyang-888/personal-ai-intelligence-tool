import type { ReactNode } from "react";

type SectionBlockProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

/** Consistent vertical section spacing on main pages. */
export function SectionBlock({ children, id, className = "" }: SectionBlockProps) {
  return (
    <section id={id} className={`mb-10 ${className}`.trim()}>
      {children}
    </section>
  );
}
