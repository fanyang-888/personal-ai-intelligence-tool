"use client";

import Link from "next/link";
import { BackLink } from "@/components/shared/back-link";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { uiTextLinkNeutral, uiTextLinkPrimary } from "@/lib/ui/classes";
import type { Cluster } from "@/types/cluster";

type ClusterStoryFooterProps = {
  nextCluster: Cluster | undefined;
};

export function ClusterStoryFooter({ nextCluster }: ClusterStoryFooterProps) {
  const { t, lang } = useI18n();

  return (
    <footer className="mt-10 border-t border-zinc-200 pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <BackLink href="/">{t.cluster.backToDigest}</BackLink>
          {nextCluster ? (
            <Link
              href={`/cluster/${nextCluster.id}`}
              className={uiTextLinkNeutral}
            >
              {t.cluster.nextStory}: {pickLocalized(nextCluster.title, lang)}
            </Link>
          ) : null}
        </div>
        {!nextCluster ? (
          <p className="text-sm text-zinc-600">
            {t.cluster.allCaughtUpToday}{" "}
            <Link href="/archive" className={uiTextLinkPrimary}>
              {t.cluster.caughtUpViewArchive}
            </Link>
            <span aria-hidden> →</span>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
