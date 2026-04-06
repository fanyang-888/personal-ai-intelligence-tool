"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { TopNavSearch } from "@/components/layout/top-nav-search";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { uiTextLinkNav } from "@/lib/ui/classes";

export function TopNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const onArchive = pathname === "/archive";
  const onDigest = pathname === "/";

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
        >
          Personal AI Intelligence
        </Link>
        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:gap-x-4"
          aria-label={t.nav.mainAria}
        >
          <Link
            href="/"
            className={`shrink-0 ${uiTextLinkNav}${
              onDigest ? " font-semibold text-emerald-900" : ""
            }`}
          >
            {t.nav.dailyDigest}
          </Link>
          <Link
            href="/archive"
            scroll
            className={
              onArchive
                ? "shrink-0 rounded-md bg-emerald-100/90 px-2.5 py-1 text-sm font-semibold text-emerald-950 ring-1 ring-emerald-600/25"
                : "shrink-0 rounded-md border border-emerald-600/35 bg-emerald-50/90 px-2.5 py-1 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-100/80"
            }
            aria-current={onArchive ? "page" : undefined}
          >
            {t.nav.archive}
          </Link>
          <Link
            href="/#draft-of-the-day"
            className={`shrink-0 ${uiTextLinkNav}`}
          >
            {t.nav.draftOfDay}
          </Link>
        </nav>
        <div className="flex min-w-0 flex-1 basis-full flex-wrap items-center justify-end gap-2 sm:basis-[min(100%,12rem)]">
          <div className="min-w-0 max-w-full flex-1 sm:max-w-xs">
            <Suspense
              fallback={
                <div
                  className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50"
                  aria-hidden
                />
              }
            >
              <TopNavSearch />
            </Suspense>
          </div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
