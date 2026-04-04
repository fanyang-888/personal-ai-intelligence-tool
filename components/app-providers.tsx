"use client";

import type { ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";

function I18nVisualGate({ children }: { children: ReactNode }) {
  const { i18nReady } = useI18n();

  return (
    <div
      className={
        i18nReady
          ? "flex min-h-0 min-w-0 flex-1 flex-col opacity-100 transition-opacity duration-200"
          : "flex min-h-0 min-w-0 flex-1 flex-col opacity-0 pointer-events-none"
      }
      aria-busy={!i18nReady}
    >
      {children}
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <I18nVisualGate>{children}</I18nVisualGate>
    </I18nProvider>
  );
}
