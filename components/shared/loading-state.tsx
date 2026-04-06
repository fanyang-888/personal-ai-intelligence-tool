"use client";

import { useI18n } from "@/lib/i18n";

export type LoadingLayout = "digest" | "archive" | "detail";

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/70 ${className}`}
      aria-hidden
    />
  );
}

type LoadingStateProps = {
  layout: LoadingLayout;
};

/**
 * Page-level skeleton loading — visually distinct from empty (dashed) and error states.
 */
export function LoadingState({ layout }: LoadingStateProps) {
  const { t } = useI18n();
  const label =
    layout === "archive"
      ? t.archive.loading
      : layout === "digest"
        ? t.loading.digest
        : t.loading.detail;

  if (layout === "archive") {
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <p className="sr-only">{label}</p>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Skeleton className="h-10 min-w-[10rem] flex-1" />
          <Skeleton className="h-10 min-w-[10rem] flex-1" />
          <Skeleton className="h-10 min-w-[10rem] flex-1" />
        </div>
        <Skeleton className="h-5 w-32" />
        <ul className="space-y-4">
          <li>
            <Skeleton className="h-28 w-full rounded-lg" />
          </li>
          <li>
            <Skeleton className="h-28 w-full rounded-lg" />
          </li>
        </ul>
      </div>
    );
  }

  if (layout === "digest") {
    return (
      <div className="space-y-8" aria-busy="true" aria-live="polite">
        <p className="sr-only">{label}</p>
        <div className="space-y-2 border-b border-zinc-100 pb-8">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_min(18rem,34%)]">
          <Skeleton className="h-72 w-full rounded-lg lg:min-h-[18rem]" />
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <p className="sr-only">{label}</p>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
