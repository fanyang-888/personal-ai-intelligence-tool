"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

type PipelineRunSummary = {
  id: string;
  status: string;
  started_at: string;
  total_elapsed_sec: number | null;
};

type Stats = {
  total_articles: number;
  articles_last_24h: number;
  total_clusters: number;
  clusters_last_7d: number;
  total_sources: number;
  active_sources: number;
  total_drafts: number;
  last_pipeline_run: PipelineRunSummary | null;
};

function fmt(sec: number) {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(iso));
}

type CardProps = {
  title: string;
  value: string | number;
  sub?: string;
  href?: string;
  accent?: boolean;
};

function StatCard({ title, value, sub, href, accent }: CardProps) {
  const inner = (
    <div
      className="rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm"
      style={{ borderColor: "var(--sp-border)" }}
    >
      <p className="text-xs text-zinc-500">{title}</p>
      <p
        className="mt-1.5 text-3xl font-light tabular-nums"
        style={{ color: accent ? "var(--sp-accent-mid)" : "var(--sp-navy)" }}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : <>{inner}</>;
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Stats>("/api/admin/stats")
      .then(setStats)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const run = stats?.last_pipeline_run;
  const runStatusColor =
    run?.status === "success" ? "#16a34a" :
    run?.status === "failed" ? "#dc2626" :
    "#d97706";

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1
        className="mb-6 text-2xl font-light"
        style={{ fontFamily: "'Fraunces', serif", color: "var(--sp-navy)" }}
      >
        仪表盘
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">加载失败：{error}</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              title="总文章数"
              value={stats.total_articles.toLocaleString()}
              sub={`今日新增 ${stats.articles_last_24h}`}
              href="/admin/articles"
            />
            <StatCard
              title="总 Clusters"
              value={stats.total_clusters.toLocaleString()}
              sub={`近 7 天 ${stats.clusters_last_7d}`}
              href="/admin/clusters"
            />
            <StatCard
              title="信源"
              value={stats.active_sources}
              sub={`共 ${stats.total_sources} 个`}
              href="/admin/sources"
            />
            <StatCard
              title="Drafts"
              value={stats.total_drafts}
              href="/admin/drafts"
            />
          </div>

          {/* Pipeline status */}
          <div
            className="mt-6 rounded-xl border bg-white p-5"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-700">最近一次 Pipeline</p>
              <Link
                href="/admin/pipeline-runs"
                className="text-xs"
                style={{ color: "var(--sp-accent-mid)" }}
              >
                查看全部 →
              </Link>
            </div>
            {run ? (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    color: runStatusColor,
                    background: `${runStatusColor}18`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: runStatusColor }}
                  />
                  {run.status === "running" ? "运行中" :
                   run.status === "success" ? "成功" : "失败"}
                </span>
                <span className="text-sm text-zinc-600">
                  {fmtDate(run.started_at)}（北京时间）
                </span>
                {run.total_elapsed_sec != null && (
                  <span className="text-sm text-zinc-500">
                    耗时 {fmt(run.total_elapsed_sec)}
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">暂无运行记录</p>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
              快捷操作
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/admin/sources", label: "信源健康状态" },
                { href: "/admin/clusters", label: "Cluster 质量检查" },
                { href: "/admin/articles", label: "浏览文章" },
                { href: "/admin/drafts", label: "Draft 管理" },
                { href: "/admin/pipeline-runs", label: "Pipeline 历史" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-zinc-50"
                  style={{ borderColor: "var(--sp-border)", color: "#3f3f46" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
