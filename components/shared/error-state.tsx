"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { uiButtonSecondary } from "@/lib/ui/classes";

type ErrorStateProps = {
  title?: string;
  message?: string;
  /** e.g. Next.js error boundary reset */
  onRetry?: () => void;
  children?: ReactNode;
};

export function ErrorState({
  title,
  message,
  onRetry,
  children,
}: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <div
      className="rounded-lg border border-amber-200/90 border-l-4 border-l-amber-500 bg-amber-50/50 px-4 py-6"
      role="alert"
    >
      <h1 className="text-lg font-semibold text-foreground">
        {title ?? t.error.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">
        {message ?? t.error.description}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={`mt-4 ${uiButtonSecondary}`}
        >
          {t.error.tryAgain}
        </button>
      ) : null}
      {children}
    </div>
  );
}
