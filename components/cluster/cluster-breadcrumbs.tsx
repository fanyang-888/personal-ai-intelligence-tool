"use client";

import { BilingualAssistBreadcrumbTitle } from "@/components/shared/bilingual-assist-text";
import { BackLink } from "@/components/shared/back-link";
import { useI18n } from "@/lib/i18n";
import type { LocalizedString } from "@/types/localized";

type ClusterBreadcrumbsProps = {
  clusterTitle: LocalizedString;
};

export function ClusterBreadcrumbs({ clusterTitle }: ClusterBreadcrumbsProps) {
  const { t, lang } = useI18n();

  return (
    <nav
      className="mb-4 text-sm text-zinc-600"
      aria-label={t.cluster.breadcrumbAria}
    >
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <li>
          <BackLink href="/">{t.nav.dailyDigest}</BackLink>
        </li>
        <li className="text-zinc-400" aria-hidden>
          /
        </li>
        <li className="min-w-0 font-medium text-foreground">
          <BilingualAssistBreadcrumbTitle
            value={clusterTitle}
            lang={lang}
          />
        </li>
      </ol>
    </nav>
  );
}
