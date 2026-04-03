"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/search-bar";
import { SectionTitle } from "@/components/shared/section-title";

export function QuickArchiveEntry() {
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
    <section
      className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6"
      aria-labelledby="quick-search-heading"
    >
      <SectionTitle id="quick-search-heading">Quick Search / Archive</SectionTitle>
      <p className="mb-4 text-sm text-zinc-500">
        Search by company, model, theme, or keyword
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchBar
          value={q}
          onChange={setQ}
          id="home-archive-search"
          label="Search"
          placeholder="e.g. OpenAI, RAG, evals…"
          className="mb-0"
        />
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Search archive
          </button>
          <Link
            href="/archive"
            className="text-sm font-semibold text-emerald-800 underline decoration-emerald-600/40 underline-offset-4 hover:text-emerald-950"
          >
            Go to Archive
          </Link>
        </div>
      </form>
    </section>
  );
}
