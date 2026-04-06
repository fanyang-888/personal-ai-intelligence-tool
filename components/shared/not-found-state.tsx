"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { BackLink } from "@/components/shared/back-link";

type NotFoundStateProps = {
  title?: string;
  message?: string;
  children?: ReactNode;
};

export function NotFoundState({
  title,
  message,
  children,
}: NotFoundStateProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-foreground">
        {title ?? "Not found"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        {message ?? "We could not find that page or item."}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
      <div className="mt-6 flex justify-center">
        <BackLink href="/">{t.notFound.backToDigest}</BackLink>
      </div>
    </div>
  );
}
