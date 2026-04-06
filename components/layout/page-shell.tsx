import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main
      className={`mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 ${className}`.trim()}
    >
      {children}
    </main>
  );
}
