"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";

export function TopNavSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = q.trim();
    const url = trimmed
      ? `/archive?q=${encodeURIComponent(trimmed)}`
      : "/archive";
    router.push(url);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 max-w-[220px] flex-1 sm:max-w-xs"
      role="search"
      aria-label="Site search"
    >
      <SearchBar
        value={q}
        onChange={setQ}
        id="nav-search"
        compact
        placeholder="Search archive…"
        className="mb-0 w-full"
      />
    </form>
  );
}
