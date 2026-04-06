import type { ReactNode } from "react";

type ActionRowProps = {
  children: ReactNode;
  className?: string;
};

export function ActionRow({ children, className = "" }: ActionRowProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
