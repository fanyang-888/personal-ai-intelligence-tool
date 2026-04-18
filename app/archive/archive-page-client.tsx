"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSearch } from "@/lib/api";
import type { ArchiveResultRow, ArchiveClusterRow, ArchiveArticleRow } from "@/lib/mappers/archive";
import { archiveHref, parseArchiveQuery } from "@/lib/utils/archive-url";
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
import { LoadingState } from "@/components/shared/loading-state";

const KEYWORD_URL_DEBOUNCE_MS = 350;
const SEARCH_DEBOUNCE_MS = 400;

function toClusterRow(c: { id: string; title: string; title_zh: string | null; summary: string | null; tags: string[]; theme: string; storyStatus: string; clusterScore: number | null; lastSeenAt: string | null; sourceCount: number }): ArchiveClusterRow {
  return {
    kind: "cluster",
    id: c.id,
    title: c.title_zh || c.title,
    theme: c.theme,
    themeLabel: c.theme,
    summarySnippet: (c.summary ?? "").slice(0, 160),
    sourceLabels: c.sourceCount > 0 ? `${c.sourceCount} source${c.sourceCount > 1 ? "s" : ""}` : "—",
    freshnessLabel: c.lastSeenAt
      ? (() => {
          const diff = (Date.now() - new Date(c.lastSeenAt).getTime()) / 60000;
          if (diff < 60) return `Updated ${Math.round(diff)}m ago`;
          if (diff < 1440) return `Updated ${Math.round(diff / 60)}h ago`;
          return `Updated ${Math.round(diff / 1440)}d ago`;
        })()
      : undefined,
  };
}

function toArticleRow(a: { id: string; title: string; excerpt: string | null; sourceName: string | null; publishedAt: string | null; url: string }): ArchiveArticleRow {
  return {
    kind: "article",
    id: a.id,
    sourceName: a.sourceName ?? "Unknown",
    title: a.title,
    url: a.url,
    excerptSnippet: (a.excerpt ?? "").slice(0, 160),
    clusterId: "",
    clusterTitle: "",
    themeLabel: "",
    publishedLabel: a.publishedAt
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(a.publishedAt))
      : "",
  };
}

export function ArchivePageClient() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [channel, setChannel] = useState("");
  const [resultMode, setResultMode] = useState<ArchiveResultMode>("clusters");

  const [rows, setRows] = useState<ArchiveResultRow[]>([]);
  const [allThemes, setAllThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const spKey = searchParams.toString();
  useEffect(() => {
    const p = parseArchiveQuery(new URLSearchParams(spKey));
    startTransition(() => {
      setKeyword(p.q);
      setTheme(p.theme);
      setSourceId(p.sourceId);
      setChannel(p.channel);
    });
  }, [spKey]);

  // URL debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestFiltersRef = useRef({ theme: "", sourceId: "", channel: "" });
  useEffect(() => {
    latestFiltersRef.current = { theme, sourceId, channel };
  }, [theme, sourceId, channel]);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  // Search debounce
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string, th: string, src: string, mode: ArchiveResultMode) => {
    setLoading(true);
    try {
      const apiType = mode === "clusters" ? "cluster" : "article";
      const result = await fetchSearch({
        q: q || undefined,
        theme: th || undefined,
        source: src || undefined,
        type: apiType,
        limit: 30,
      });
      if (mode === "clusters") {
        setRows(result.clusters.map(toClusterRow));
        // Collect unique themes from results
        const themes = [...new Set(result.clusters.map(c => c.theme).filter(Boolean))];
        if (themes.length) setAllThemes(themes);
      } else {
        setRows(result.articles.map(toArticleRow));
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  }, []);

  // Re-search when filters change
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      doSearch(keyword, theme, sourceId, resultMode);
    }, keyword ? SEARCH_DEBOUNCE_MS : 0);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [keyword, theme, sourceId, resultMode, doSearch]);

  const scheduleKeywordUrlSync = useCallback((nextQ: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { theme: t, sourceId: s, channel: ch } = latestFiltersRef.current;
      router.replace(archiveHref({ q: nextQ, theme: t, sourceId: s, channel: ch }));
    }, KEYWORD_URL_DEBOUNCE_MS);
  }, [router]);

  function handleKeywordChange(value: string) { setKeyword(value); scheduleKeywordUrlSync(value); }
  function handleThemeChange(t: string) { if (debounceRef.current) clearTimeout(debounceRef.current); setTheme(t); router.replace(archiveHref({ q: keyword, theme: t, sourceId, channel })); }
  function handleSourceChange(id: string) { if (debounceRef.current) clearTimeout(debounceRef.current); setSourceId(id); router.replace(archiveHref({ q: keyword, theme, sourceId: id, channel })); }
  function handleChannelChange(ch: string) { if (debounceRef.current) clearTimeout(debounceRef.current); setChannel(ch); router.replace(archiveHref({ q: keyword, theme, sourceId, channel: ch })); }

  const hasActiveFilters = Boolean(keyword.trim() || theme || sourceId || channel);
  const showNoResults = rows.length === 0 && hasActiveFilters && !loading && initialLoaded;
  const showAllEmpty = rows.length === 0 && !hasActiveFilters && !loading && initialLoaded;

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
        themes={allThemes}
        sources={[]}
        onThemeChange={handleThemeChange}
        onSourceChange={handleSourceChange}
        onChannelChange={handleChannelChange}
      />

      <SectionBlock>
        <SectionTitle>{t.archive.results}</SectionTitle>
        <div className="min-h-[min(45vh,22rem)]">
          {loading ? (
            <LoadingState layout="archive" />
          ) : showAllEmpty ? (
            <EmptyState title={resultMode === "clusters" ? t.archive.emptyCatalog : t.archive.emptyCatalogArticles}>
              <ArchiveThemeSuggestions themes={allThemes} onPickTheme={handleThemeChange} />
            </EmptyState>
          ) : showNoResults ? (
            <NoResultsState title={t.archive.noResultsTitle} message={t.archive.noResultsMessage}>
              <ArchiveThemeSuggestions themes={allThemes} onPickTheme={handleThemeChange} />
            </NoResultsState>
          ) : (
            <ul className={resultMode === "clusters" ? "space-y-4" : "space-y-2.5"}>
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
