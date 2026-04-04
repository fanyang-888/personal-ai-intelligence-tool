"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { TopNavSearch } from "@/components/layout/top-nav-search";
import { LanguageToggle } from "@/components/layout/language-toggle";

const linkClass =
  "shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:text-emerald-800 hover:underline";

export function TopNav() {
  const { t } = useI18n();

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
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
          aria-label={t.nav.mainAria}
        >
          <Link href="/" className={linkClass}>
            {t.nav.dailyDigest}
          </Link>
          <Link href="/archive" className={linkClass}>
            {t.nav.archive}
          </Link>
          <Link href="/#draft-of-the-day" className={linkClass}>
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
