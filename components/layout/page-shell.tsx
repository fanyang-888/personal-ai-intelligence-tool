import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main
      className={`mx-auto w-full max-w-[1280px] flex-1 px-6 sm:px-10 py-8 pb-24 sm:pb-10 ${className}`.trim()}
    >
      {children}
    </main>
  );
}
