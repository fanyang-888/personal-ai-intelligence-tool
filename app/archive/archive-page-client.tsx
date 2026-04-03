"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clusters } from "@/lib/mock-data/clusters";
import { sources } from "@/lib/mock-data/sources";
import { filterClusters, uniqueThemes } from "@/lib/utils/search";
import { mapClustersToArchiveRows } from "@/lib/mappers/archive";
import { SearchBar } from "@/components/archive/search-bar";
import { FilterBar } from "@/components/archive/filter-bar";
import { ResultCard } from "@/components/archive/result-card";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { NotFoundState } from "@/components/shared/not-found-state";

export function ArchivePageClient() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [theme, setTheme] = useState("");
  const [sourceId, setSourceId] = useState("");

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
  }, [searchParams]);

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
        onChange={setKeyword}
        id="archive-search"
        placeholder="Keyword in title or summary…"
      />
      <FilterBar
        theme={theme}
        sourceId={sourceId}
        themes={themes}
        sources={sourceOptions}
        onThemeChange={setTheme}
        onSourceChange={setSourceId}
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
