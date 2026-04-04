"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Cluster } from "@/types/cluster";

type ClusterStoryFooterProps = {
  nextCluster: Cluster | undefined;
};

export function ClusterStoryFooter({ nextCluster }: ClusterStoryFooterProps) {
  const { t } = useI18n();

  return (
    <footer className="mt-10 border-t border-zinc-200 pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
          >
            {t.cluster.backToDigest}
          </Link>
          {nextCluster ? (
            <Link
              href={`/cluster/${nextCluster.id}`}
              className="text-sm font-semibold text-foreground underline decoration-zinc-300 underline-offset-4 hover:text-emerald-900"
            >
              {t.cluster.nextStory}: {nextCluster.title}
            </Link>
          ) : null}
        </div>
        {!nextCluster ? (
          <p className="text-sm text-zinc-600">
            {t.cluster.allCaughtUpToday}{" "}
            <Link
              href="/archive"
              className="font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
            >
              {t.cluster.caughtUpViewArchive}
            </Link>
            <span aria-hidden> →</span>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
