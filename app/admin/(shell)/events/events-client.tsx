"use client";

import { useEffect, useState } from "react";
import { apiFetchAdmin } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

type EventStats = {
  type: string;
  top_entities: { entity_id: string; count: number }[];
  daily_totals: { date: string; count: number }[];
};

type ProductMetrics = {
  weekly_engaged_readers: number;
  returning_readers: number;
  total_read_events_7d: number;
  daily_active: { date: string; devices: number }[];
};

const L = {
  en: {
    title: "Events",
    subtitle: "Click-tracking + engagement · last 7 days",
    loading: "Loading…",
    loadFailed: "Failed to load:",
    noData: "No data yet",
    noEvents: "No event data returned.",
    times: "times",
    top3: "Top entities",
    nsmTitle: "North Star — Weekly Engaged Readers",
    nsmSubtitle: "Distinct devices that read a story · last 7 days",
    wer: "Engaged readers",
    returning: "Returning (2+ days)",
    totalReads: "Story reads",
  },
  zh: {
    title: "事件统计",
    subtitle: "点击追踪 + 互动数据 · 最近 7 天",
    loading: "加载中…",
    loadFailed: "加载失败：",
    noData: "暂无数据",
    noEvents: "暂无事件数据。",
    times: "次",
    top3: "Top 实体",
    nsmTitle: "北极星 — 周活跃读者",
    nsmSubtitle: "读过故事的去重设备 · 最近 7 天",
    wer: "活跃读者",
    returning: "回访 (2+ 天)",
    totalReads: "阅读次数",
  },
} as const;

function formatTypeName(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function MiniBarChart({ daily }: { daily: { date: string; count: number }[] }) {
  // daily_totals: newest first — we want newest on left, so use as-is
  const bars = daily.slice(0, 7);
  const maxCount = Math.max(...bars.map((d) => d.count), 1);
  const hasData = bars.some((d) => d.count > 0);

  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {bars.map((d, i) => {
        const heightPct = hasData ? Math.max((d.count / maxCount) * 100, d.count > 0 ? 4 : 0) : 0;
        return (
          <div
            key={i}
            className="group relative flex-1 rounded-sm"
            style={{ height: "100%", display: "flex", alignItems: "flex-end" }}
            title={`${d.date}: ${d.count}`}
          >
            <div
              className="w-full rounded-sm transition-all"
              style={{
                height: `${heightPct}%`,
                minHeight: d.count > 0 ? 2 : 0,
                background: heightPct > 0 ? "var(--sp-accent-mid, #3b82f6)" : "#e4e4e7",
                opacity: heightPct > 0 ? 0.85 : 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function EventCard({ stat, t }: { stat: EventStats; t: typeof L[keyof typeof L] }) {
  const top3 = stat.top_entities.slice(0, 3);
  const allZero = stat.daily_totals.every((d) => d.count === 0) && top3.every((e) => e.count === 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-700">{formatTypeName(stat.type)}</p>

      {allZero ? (
        <p className="mt-3 text-xs text-zinc-400">{t.noData}</p>
      ) : (
        <>
          {/* 7-day bar chart */}
          <div className="mt-3">
            <MiniBarChart daily={stat.daily_totals} />
            <div className="mt-1 flex justify-between">
              {stat.daily_totals.slice(0, 7).map((d, i) => (
                <span key={i} className="flex-1 text-center text-[9px] text-zinc-300 leading-none">
                  {d.date.slice(5)} {/* MM-DD */}
                </span>
              ))}
            </div>
          </div>

          {/* Top 3 entities */}
          {top3.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {t.top3}
              </p>
              <div className="space-y-1">
                {top3.map((e) => (
                  <div key={e.entity_id} className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs text-zinc-600">
                      {e.entity_id.length > 12 ? `${e.entity_id.slice(0, 12)}…` : e.entity_id}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {e.count} {t.times}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MetricsPanel({ m, t }: { m: ProductMetrics; t: typeof L[keyof typeof L] }) {
  const stats = [
    { value: m.weekly_engaged_readers, label: t.wer },
    { value: m.returning_readers, label: t.returning },
    { value: m.total_read_events_7d, label: t.totalReads },
  ];
  return (
    <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-700">{t.nsmTitle}</p>
      <p className="mt-0.5 text-[11px] text-zinc-400">{t.nsmSubtitle}</p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p
              className="text-3xl font-light"
              style={{ color: "var(--sp-navy)", fontFamily: "'Fraunces', serif" }}
            >
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsClient() {
  const { lang } = useI18n();
  const t = L[lang];

  const [events, setEvents] = useState<EventStats[]>([]);
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetchAdmin<EventStats[]>("/api/admin/events"),
      apiFetchAdmin<ProductMetrics>("/api/admin/metrics").catch(() => null),
    ])
      .then(([ev, m]) => {
        setEvents(ev);
        setMetrics(m);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-light"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--sp-navy)" }}
        >
          {t.title}
        </h1>
        <p className="mt-0.5 text-sm text-zinc-400">{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">
          {t.loadFailed} {error}
        </p>
      ) : (
        <>
          {metrics ? <MetricsPanel m={metrics} t={t} /> : null}
          {events.length === 0 ? (
            <p className="text-sm text-zinc-500">{t.noEvents}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((stat) => (
                <EventCard key={stat.type} stat={stat} t={t} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
