"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clusters } from "@/lib/mock-data/clusters";
import { sources } from "@/lib/mock-data/sources";
import { filterClusters, uniqueThemes } from "@/lib/utils/search";
import { mapClustersToArchiveRows } from "@/lib/mappers/archive";
import {
  archiveHref,
  parseArchiveQuery,
} from "@/lib/utils/archive-url";
import { SearchBar } from "@/components/archive/search-bar";
import { FilterBar } from "@/components/archive/filter-bar";
import { ResultCard } from "@/components/archive/result-card";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { NotFoundState } from "@/components/shared/not-found-state";

const KEYWORD_URL_DEBOUNCE_MS = 350;

export function ArchivePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [sourceId, setSourceId] = useState("");

  const spKey = searchParams.toString();
  useEffect(() => {
    const p = parseArchiveQuery(new URLSearchParams(spKey));
    /* eslint-disable react-hooks/set-state-in-effect -- sync controlled fields from URL (back/forward, shared links) */
    setKeyword(p.q);
    setTheme(p.theme);
    setSourceId(p.sourceId);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [spKey]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const latestFiltersRef = useRef({ theme: "", sourceId: "" });

  useEffect(() => {
    latestFiltersRef.current = { theme, sourceId };
  }, [theme, sourceId]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const scheduleKeywordUrlSync = useCallback(
    (nextQ: string) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const { theme: t, sourceId: s } = latestFiltersRef.current;
        router.replace(archiveHref({ q: nextQ, theme: t, sourceId: s }));
      }, KEYWORD_URL_DEBOUNCE_MS);
    },
    [router],
  );

  function handleKeywordChange(value: string) {
    setKeyword(value);
    scheduleKeywordUrlSync(value);
  }

  function handleThemeChange(t: string) {
    clearTimeout(debounceRef.current);
    setTheme(t);
    router.replace(archiveHref({ q: keyword, theme: t, sourceId }));
  }

  function handleSourceChange(id: string) {
    clearTimeout(debounceRef.current);
    setSourceId(id);
    router.replace(archiveHref({ q: keyword, theme, sourceId: id }));
  }

  const themes = useMemo(() => uniqueThemes(clusters), []);
  const sourceOptions = useMemo(
    () => sources.map((s) => ({ id: s.id, name: s.name })),
    [],
  );

  const filtered = useMemo(
    () => filterClusters(clusters, { keyword, theme, sourceId }),
    [keyword, theme, sourceId],
  );

  const rows = useMemo(() => mapClustersToArchiveRows(filtered), [filtered]);

  const hasActiveFilters = Boolean(keyword.trim() || theme || sourceId);
  const showNoResults = rows.length === 0 && hasActiveFilters;
  const showAllEmpty = rows.length === 0 && !hasActiveFilters;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Archive</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Search and filter mock clusters — memory / retrieval layer (local only).
        </p>
      </header>

      <SearchBar
        value={keyword}
        onChange={handleKeywordChange}
        id="archive-search"
        placeholder="Keyword in title or summary…"
      />
      <FilterBar
        theme={theme}
        sourceId={sourceId}
        themes={themes}
        sources={sourceOptions}
        onThemeChange={handleThemeChange}
        onSourceChange={handleSourceChange}
      />

      <SectionTitle>Results</SectionTitle>

      {showAllEmpty ? (
        <EmptyState title="No clusters in catalog" />
      ) : showNoResults ? (
        <NotFoundState
          title="No results"
          message="Try a different keyword, theme, or source."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <ResultCard key={row.id} row={row} />
          ))}
        </ul>
      )}
    </div>
  );
}
