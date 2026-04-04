"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Draft } from "@/types/draft";

type DraftHeaderProps = {
  draft: Draft;
  clusterTitle: string;
};

export function DraftHeader({ draft, clusterTitle }: DraftHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{draft.title}</h1>
      {draft.topic ? (
        <p className="mt-2 text-sm text-zinc-600">
          {t.draft.topicLabel} {draft.topic}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-foreground">
        {t.draft.linkedClusterPrefix}{" "}
        <Link href={`/cluster/${draft.clusterId}`} className="font-medium underline">
          {clusterTitle}
        </Link>
      </p>
    </header>
  );
}
