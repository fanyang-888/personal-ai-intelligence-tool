"use client";

import { NotFoundState } from "@/components/shared/not-found-state";
import { useI18n } from "@/lib/i18n";

type LocalizedNotFoundProps = {
  variant: "cluster" | "draft";
};

export function LocalizedNotFound({ variant }: LocalizedNotFoundProps) {
  const { t } = useI18n();

  if (variant === "draft") {
    return (
      <NotFoundState title={t.notFound.draftTitle} message={t.notFound.draftMessage} />
    );
  }

  return (
    <NotFoundState title={t.notFound.clusterTitle} message={t.notFound.clusterMessage} />
  );
}
