"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { articles } from "@/lib/mock-data/articles";
import { clusters } from "@/lib/mock-data/clusters";
import { sources } from "@/lib/mock-data/sources";
import {
  filterArticles,
  filterClusters,
  uniqueThemes,
} from "@/lib/utils/search";
import {
  mapArticlesToArchiveRows,
  mapClustersToArchiveRows,
  type ArchiveResultRow,
} from "@/lib/mappers/archive";
import {
  archiveHref,
  parseArchiveQuery,
} from "@/lib/utils/archive-url";
import { useI18n } from "@/lib/i18n";
import { ArchiveResultCard } from "@/components/archive/archive-result-card";
import { ArchiveThemeSuggestions } from "@/components/archive/archive-theme-suggestions";
import { SearchBar } from "@/components/archive/search-bar";
import { FilterRow } from "@/components/archive/filter-bar";
import {
  ResultModeToggle,
  type ArchiveResultMode,
} from "@/components/archive/result-mode-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { NoResultsState } from "@/components/shared/no-results-state";

const KEYWORD_URL_DEBOUNCE_MS = 350;

export function ArchivePageClient() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [channel, setChannel] = useState("");
  const [resultMode, setResultMode] = useState<ArchiveResultMode>("clusters");

  const spKey = searchParams.toString();
  useEffect(() => {
    const p = parseArchiveQuery(new URLSearchParams(spKey));
    /* eslint-disable react-hooks/set-state-in-effect -- sync controlled fields from URL (back/forward, shared links) */
    startTransition(() => {
      setKeyword(p.q);
      setTheme(p.theme);
      setSourceId(p.sourceId);
      setChannel(p.channel);
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [spKey]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestFiltersRef = useRef({ theme: "", sourceId: "", channel: "" });

  useEffect(() => {
    latestFiltersRef.current = { theme, sourceId, channel };
  }, [theme, sourceId, channel]);

  useEffect(
    () => () => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    },
    [],
  );

  const scheduleKeywordUrlSync = useCallback(
    (nextQ: string) => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const { theme: t, sourceId: s, channel: ch } = latestFiltersRef.current;
        router.replace(archiveHref({ q: nextQ, theme: t, sourceId: s, channel: ch }));
      }, KEYWORD_URL_DEBOUNCE_MS);
    },
    [router],
  );

  function handleKeywordChange(value: string) {
    setKeyword(value);
    scheduleKeywordUrlSync(value);
  }

  function handleThemeChange(t: string) {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    setTheme(t);
    router.replace(archiveHref({ q: keyword, theme: t, sourceId, channel }));
  }

  function handleSourceChange(id: string) {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    setSourceId(id);
    router.replace(archiveHref({ q: keyword, theme, sourceId: id, channel }));
  }

  function handleChannelChange(ch: string) {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    setChannel(ch);
    router.replace(archiveHref({ q: keyword, theme, sourceId, channel: ch }));
  }

  const themes = useMemo(() => uniqueThemes(clusters), []);
  const sourceOptions = useMemo(
    () => sources.map((s) => ({ id: s.id, name: s.name })),
    [],
  );

  const filteredClusters = useMemo(
    () =>
      filterClusters(clusters, {
        keyword,
        theme,
        sourceId,
        channel,
      }),
    [keyword, theme, sourceId, channel],
  );

  const filteredArticles = useMemo(
    () =>
      filterArticles(articles, {
        keyword,
        theme,
        sourceId,
        channel,
      }),
    [keyword, theme, sourceId, channel],
  );

  const clusterRows = useMemo(
    () => mapClustersToArchiveRows(filteredClusters, lang),
    [filteredClusters, lang],
  );

  const articleRows = useMemo(
    () => mapArticlesToArchiveRows(filteredArticles, lang),
    [filteredArticles, lang],
  );

  const rows: ArchiveResultRow[] = useMemo(
    () => (resultMode === "clusters" ? clusterRows : articleRows),
    [resultMode, clusterRows, articleRows],
  );

  const hasActiveFilters = Boolean(
    keyword.trim() || theme || sourceId || channel,
  );
  const showNoResults = rows.length === 0 && hasActiveFilters;
  const showAllEmpty = rows.length === 0 && !hasActiveFilters;

  return (
    <div>
      <PageHeader
        title={t.archive.title}
        description={t.archive.description}
        descriptionCompact
      />

      <SearchBar
        value={keyword}
        onChange={handleKeywordChange}
        id="archive-search"
        label={t.archive.searchLabel}
        placeholder={t.archive.searchPlaceholder}
      />
      <ResultModeToggle value={resultMode} onChange={setResultMode} />
      <FilterRow
        theme={theme}
        sourceId={sourceId}
        channel={channel}
        themes={themes}
        sources={sourceOptions}
        onThemeChange={handleThemeChange}
        onSourceChange={handleSourceChange}
        onChannelChange={handleChannelChange}
      />

      <SectionBlock>
        <SectionTitle>{t.archive.results}</SectionTitle>

        <div className="min-h-[min(45vh,22rem)]">
          {showAllEmpty ? (
            <EmptyState
              title={
                resultMode === "clusters"
                  ? t.archive.emptyCatalog
                  : t.archive.emptyCatalogArticles
              }
            >
              <ArchiveThemeSuggestions themes={themes} onPickTheme={handleThemeChange} />
            </EmptyState>
          ) : showNoResults ? (
            <NoResultsState
              title={t.archive.noResultsTitle}
              message={t.archive.noResultsMessage}
            >
              <ArchiveThemeSuggestions themes={themes} onPickTheme={handleThemeChange} />
            </NoResultsState>
          ) : (
            <ul
              className={
                resultMode === "clusters" ? "space-y-4" : "space-y-2.5"
              }
            >
              {rows.map((row) => (
                <ArchiveResultCard key={row.id} row={row} highlightQuery={keyword} />
              ))}
            </ul>
          )}
        </div>
      </SectionBlock>
    </div>
  );
}
