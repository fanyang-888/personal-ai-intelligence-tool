"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { getClusterById } from "@/lib/mock-data/clusters";
import { getDraftById } from "@/lib/mock-data/drafts";
import { pickLocalized } from "@/lib/utils/localized-string";

function truncateTitle(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Sets document.title from route + language (static export has no per-request metadata).
 */
export function DocumentTitle() {
  const pathname = usePathname();
  const params = useParams();
  const { t, lang, i18nReady } = useI18n();

  useEffect(() => {
    if (!i18nReady) return;

    const brand = t.meta.titleBrand;
    let pagePart = t.meta.titleHome;

    if (pathname === "/archive") {
      pagePart = t.meta.titleArchive;
    } else if (pathname.startsWith("/cluster/")) {
      const id = typeof params?.id === "string" ? params.id : undefined;
      const cluster = id ? getClusterById(id) : undefined;
      pagePart = cluster
        ? truncateTitle(pickLocalized(cluster.title, lang), 52)
        : t.meta.titleStoryFallback;
    } else if (pathname.startsWith("/draft/")) {
      const id = typeof params?.id === "string" ? params.id : undefined;
      const draft = id ? getDraftById(id) : undefined;
      pagePart = draft
        ? truncateTitle(pickLocalized(draft.title, lang), 52)
        : t.meta.titleDraftFallback;
    } else if (pathname === "/") {
      pagePart = t.meta.titleHome;
    }

    document.title = `${pagePart} | ${brand}`;
  }, [i18nReady, pathname, params, lang, t]);

  return null;
}
