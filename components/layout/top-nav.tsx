"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { TopNavSearch } from "@/components/layout/top-nav-search";
import { LanguageToggle } from "@/components/layout/language-toggle";

export function TopNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const onArchive = pathname === "/archive";
  const onDigest = pathname === "/";
  const onDraft = pathname.startsWith("/draft");

  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--sp-navy)" }}>
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-0 h-14">

        {/* Brand */}
        <Link href="/" className="shrink-0 flex items-center gap-2 text-[22px] tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: "#a8d8f0" }}>
          <Image src="/logo.png" alt="Sipply" width={28} height={28} className="shrink-0" />
          Sip
          <span style={{ fontWeight: 400, color: "#5dc8f5" }}>ply</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-4 sm:gap-7" aria-label={t.nav.mainAria}>
          <Link
            href="/"
            className="text-[12px] tracking-[0.05em] transition-colors duration-200"
            style={{ color: onDigest ? "#5dc8f5" : "#6aabcc" }}
          >
            <span className="sm:hidden">{t.nav.dailyDigestShort}</span>
            <span className="hidden sm:inline">{t.nav.dailyDigest}</span>
          </Link>
          <Link
            href="/archive"
            className="text-[12px] tracking-[0.05em] transition-colors duration-200"
            style={{ color: onArchive ? "#5dc8f5" : "#6aabcc" }}
          >
            {t.nav.archive}
          </Link>
          <Link
            href="/#draft-of-the-day"
            className="text-[12px] tracking-[0.05em] transition-colors duration-200"
            style={{ color: onDraft ? "#5dc8f5" : "#6aabcc" }}
          >
            <span className="sm:hidden">{t.nav.draftOfDayShort}</span>
            <span className="hidden sm:inline">{t.nav.draftOfDay}</span>
          </Link>
        </nav>

        {/* Spacer + Search + Lang */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="w-44 sm:w-56">
            <Suspense
              fallback={
                <div
                  className="h-8 w-full rounded-md"
                  style={{ background: "#163f5c", border: "1px solid #1a5280" }}
                  aria-hidden
                />
              }
            >
              <TopNavSearchDark />
            </Suspense>
          </div>
          <LanguageToggleDark />
        </div>
      </div>
    </header>
  );
}

/* Thin wrappers that inject dark-theme classes onto the shared sub-components */
function TopNavSearchDark() {
  return (
    <div className="[&_input]:!bg-[#163f5c] [&_input]:!border-[#1a5280] [&_input]:!text-[#a8d8f0] [&_input]:placeholder:!text-[#3d7a9e] [&_input]:focus:!border-[#5dc8f5] [&_input]:focus:!ring-[#5dc8f5]/20">
      <TopNavSearch />
    </div>
  );
}

function LanguageToggleDark() {
  return (
    <div className="[&_button]:!text-[#3d7a9e] [&_button]:hover:!text-[#5dc8f5] [&_.active]:!text-[#5dc8f5] text-[11px] tracking-[0.08em]">
      <LanguageToggle />
    </div>
  );
}
