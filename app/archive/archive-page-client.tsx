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
import type { ArchiveResultRow, ArchiveClusterRow } from "@/lib/mappers/archive";
import { archiveHref, parseArchiveQuery } from "@/lib/utils/archive-url";
import { topicTagsForGroup } from "@/lib/constants/topic-groups";
import { useI18n } from "@/lib/i18n";
import { ArchiveResultCard } from "@/components/archive/archive-result-card";
import { ArchiveThemeSuggestions } from "@/components/archive/archive-theme-suggestions";
import { SearchBar } from "@/components/archive/search-bar";
import { FilterRow } from "@/components/archive/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { NoResultsState } from "@/components/shared/no-results-state";
import { LoadingState } from "@/components/shared/loading-state";

function DateGroupedList({
  rows,
  keyword,
  lang,
}: {
  rows: ArchiveResultRow[];
  keyword: string;
  lang: string;
}) {
  // Build groups: [{dateKey, label, items}]
  const groups: { dateKey: string; label: string; items: ArchiveResultRow[] }[] = [];
  for (const row of rows) {
    const key = row.dateKey;
    const last = groups[groups.length - 1];
    if (last && last.dateKey === key) {
      last.items.push(row);
    } else {
      groups.push({ dateKey: key, label: formatDateGroupLabel(key, lang), items: [row] });
    }
  }

  return (
    <div className="space-y-4">
      {groups.map((group, gi) => (
        <div key={`${group.dateKey}-${gi}`}>
          {/* Date divider */}
          <div className={`flex items-center gap-3 ${gi === 0 ? "mb-3" : "mt-6 mb-3"}`}>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.1em] shrink-0"
              style={{ color: "var(--sp-accent-mid)" }}
            >
              {group.label}
            </span>
            <div className="h-px flex-1" style={{ background: "var(--sp-border)" }} />
          </div>
          <ul className="space-y-4">
            {group.items.map((row) => (
              <ArchiveResultCard key={row.id} row={row} highlightQuery={keyword} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const KEYWORD_URL_DEBOUNCE_MS = 350;
const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

type SortBy = "score" | "date";

function toDateKey(dateStr: string | null): string {
  if (!dateStr) return "unknown";
  return dateStr.slice(0, 10); // YYYY-MM-DD
}

type ArchiveT = ReturnType<typeof useI18n>["t"];

/** "arXiv · TechCrunch · The Verge +2" — names capped at 3, falls back to a count. */
function formatSourceLabels(
  sourceNames: string[],
  sourceCount: number,
  t: ArchiveT,
): string {
  if (sourceNames.length === 0) return t.archive.sourceCountLabel(sourceCount);
  const shown = sourceNames.slice(0, 3).join(" · ");
  const extra = sourceNames.length - 3;
  return extra > 0 ? `${shown} +${extra}` : shown;
}

function toClusterRow(
  c: { id: string; title: string; title_zh: string | null; summary: string | null; summary_zh: string | null; tags: string[]; theme: string; topicTag: string | null; storyStatus: string; clusterScore: number | null; lastSeenAt: string | null; sourceCount: number; sourceNames: string[] },
  t: ArchiveT,
  lang: string,
): ArchiveClusterRow {
  let freshnessLabel: string | undefined;
  if (c.lastSeenAt) {
    const diff = (Date.now() - new Date(c.lastSeenAt).getTime()) / 60000;
    if (diff < 60) freshnessLabel = t.archive.freshnessMinutes(Math.round(diff));
    else if (diff < 1440) freshnessLabel = t.archive.freshnessHours(Math.round(diff / 60));
    else freshnessLabel = t.archive.freshnessDays(Math.round(diff / 1440));
  }
  const isZh = lang === "zh";
  return {
    kind: "cluster",
    id: c.id,
    title: isZh ? (c.title_zh || c.title) : c.title,
    theme: c.theme,
    themeLabel: c.topicTag ?? c.theme,
    summarySnippet: (isZh ? (c.summary_zh ?? c.summary ?? "") : (c.summary ?? "")).slice(0, 160),
    sourceLabels: formatSourceLabels(c.sourceNames ?? [], c.sourceCount, t),
    freshnessLabel,
    dateKey: toDateKey(c.lastSeenAt),
  };
}

function formatDateGroupLabel(dateKey: string, lang: string): string {
  if (dateKey === "unknown") return lang === "zh" ? "未知日期" : "Unknown date";
  const d = new Date(dateKey + "T12:00:00Z");
  if (lang === "zh") {
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const wd = weekdays[d.getUTCDay()];
    return `${month}月${day}日 · ${wd}`;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", weekday: "short", timeZone: "UTC",
  }).format(d);
}

export function ArchivePageClient() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("score");

  const [rows, setRows] = useState<ArchiveResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const spKey = searchParams.toString();
  useEffect(() => {
    const p = parseArchiveQuery(new URLSearchParams(spKey));
    startTransition(() => {
      setKeyword(p.q);
      setTopic(p.topic);
    });
  }, [spKey]);

  // URL debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestFiltersRef = useRef({ topic: "" });
  useEffect(() => {
    latestFiltersRef.current = { topic };
  }, [topic]);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  // Search debounce
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (
    q: string,
    topicKey: string,
    sort: SortBy,
    offset: number,
    append: boolean,
  ) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const tags = topicKey ? topicTagsForGroup(topicKey) : [];
      const result = await fetchSearch({
        q: q || undefined,
        topicTags: tags.length ? tags : undefined,
        limit: PAGE_SIZE,
        offset,
        sortBy: sort,
      });

      const newRows = result.clusters.map(c => toClusterRow(c, t, lang));
      setRows(prev => append ? [...prev, ...newRows] : newRows);
      setTotal(result.total);
    } catch {
      if (!append) setRows([]);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
      setInitialLoaded(true);
    }
  }, [t, lang]);

  // Re-search when filters change (reset to page 1)
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      doSearch(keyword, topic, sortBy, 0, false);
    }, keyword ? SEARCH_DEBOUNCE_MS : 0);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [keyword, topic, sortBy, doSearch]);

  const handleLoadMore = useCallback(() => {
    doSearch(keyword, topic, sortBy, rows.length, true);
  }, [keyword, topic, sortBy, rows.length, doSearch]);

  const scheduleKeywordUrlSync = useCallback((nextQ: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { topic: tp } = latestFiltersRef.current;
      router.replace(archiveHref({ q: nextQ, topic: tp }));
    }, KEYWORD_URL_DEBOUNCE_MS);
  }, [router]);

  function handleKeywordChange(value: string) { setKeyword(value); scheduleKeywordUrlSync(value); }
  function handleTopicChange(k: string) { if (debounceRef.current) clearTimeout(debounceRef.current); setTopic(k); router.replace(archiveHref({ q: keyword, topic: k })); }

  const hasActiveFilters = Boolean(keyword.trim() || topic);
  const showNoResults = rows.length === 0 && hasActiveFilters && !loading && initialLoaded;
  const showAllEmpty = rows.length === 0 && !hasActiveFilters && !loading && initialLoaded;
  const hasMore = rows.length < total && rows.length > 0;

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
      <FilterRow topic={topic} onTopicChange={handleTopicChange} />

      <SectionBlock>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-baseline gap-2">
            <SectionTitle>{t.archive.results}</SectionTitle>
            {initialLoaded && !loading && total > 0 && (
              <span className="text-sm [color:var(--text-muted)]">
                {t.archive.resultCountStories(total)}
              </span>
            )}
          </div>
          {initialLoaded && rows.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setSortBy("score")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  sortBy === "score"
                    ? "bg-foreground text-background"
                    : "[color:var(--text-muted)] hover:text-foreground"
                }`}
              >
                {t.archive.sortBestMatch}
              </button>
              <button
                onClick={() => setSortBy("date")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  sortBy === "date"
                    ? "bg-foreground text-background"
                    : "[color:var(--text-muted)] hover:text-foreground"
                }`}
              >
                {t.archive.sortNewest}
              </button>
            </div>
          )}
        </div>

        <div className="min-h-[min(45vh,22rem)]">
          {loading ? (
            <LoadingState layout="archive" />
          ) : showAllEmpty ? (
            <EmptyState title={t.archive.emptyCatalog}>
              <ArchiveThemeSuggestions onPickTopic={handleTopicChange} activeTopic={topic} />
            </EmptyState>
          ) : showNoResults ? (
            <NoResultsState title={t.archive.noResultsTitle} message={t.archive.noResultsMessage}>
              <ArchiveThemeSuggestions onPickTopic={handleTopicChange} activeTopic={topic} />
            </NoResultsState>
          ) : (
            <>
              <DateGroupedList rows={rows} keyword={keyword} lang={lang} />

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="rounded-md border [border-color:var(--border)] px-5 py-2 text-sm font-medium [color:var(--text-muted)] transition-colors hover:[border-color:var(--border)] hover:text-foreground disabled:opacity-50"
                  >
                    {loadingMore ? t.archive.loadingMore : t.archive.loadMore(total - rows.length)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </SectionBlock>
    </div>
  );
}
