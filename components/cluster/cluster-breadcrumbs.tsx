"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type ClusterBreadcrumbsProps = {
  clusterTitle: string;
};

export function ClusterBreadcrumbs({ clusterTitle }: ClusterBreadcrumbsProps) {
  const { t } = useI18n();

  return (
    <nav
      className="mb-4 text-sm text-zinc-600"
      aria-label={t.cluster.breadcrumbAria}
    >
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <li>
          <Link
            href="/"
            className="font-medium text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
          >
            {t.nav.dailyDigest}
          </Link>
        </li>
        <li className="text-zinc-400" aria-hidden>
          /
        </li>
        <li className="min-w-0 font-medium text-foreground">
          <span className="line-clamp-2">{clusterTitle}</span>
        </li>
      </ol>
    </nav>
  );
}
