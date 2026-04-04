"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { useI18n } from "@/lib/i18n";
import { archiveHref, parseArchiveQuery } from "@/lib/utils/archive-url";

export function TopNavSearch() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = q.trim();
    if (pathname === "/archive") {
      const { theme, sourceId, channel } = parseArchiveQuery(searchParams);
      router.push(
        archiveHref({ q: trimmed, theme, sourceId, channel }),
      );
      return;
    }
    router.push(
      trimmed
        ? `/archive?q=${encodeURIComponent(trimmed)}`
        : "/archive",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 max-w-[220px] flex-1 sm:max-w-xs"
      role="search"
      aria-label={t.nav.searchAria}
    >
      <SearchBar
        value={q}
        onChange={setQ}
        id="nav-search"
        compact
        placeholder={t.nav.searchPlaceholder}
        className="mb-0 w-full"
      />
    </form>
  );
}
