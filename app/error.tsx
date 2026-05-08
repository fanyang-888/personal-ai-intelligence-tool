"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorState } from "@/components/shared/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
