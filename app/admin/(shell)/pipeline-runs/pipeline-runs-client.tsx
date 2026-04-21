"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api/client";

type StageResult = {
  status: "ok" | "failed";
  elapsed_sec: number;
};

type PipelineRun = {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: "running" | "success" | "failed";
  stage_results: Record<string, StageResult> | null;
  total_elapsed_sec: number | null;
  triggered_by: string | null;
};

const STAGE_ORDER = [
  "ingest_full_articles",
  "filter_articles",
  "score_articles",
  "cluster_articles",
  "update_cluster_status",
  "dedup_clusters",
  "summarize",
  "translate_clusters",
  "generate_draft",
  "translate_drafts",
];

const STAGE_LABEL: Record<string, string> = {
  ingest_full_articles: "Ingest",
  filter_articles: "Filter",
  score_articles: "Score",
  cluster_articles: "Cluster",
  update_cluster_status: "Status",
  dedup_clusters: "Dedup",
  summarize: "Summarize",
  translate_clusters: "Translate clusters",
  generate_draft: "Draft",
  translate_drafts: "Translate drafts",
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

function StatusDot({ status }: { status: PipelineRun["status"] }) {
  const style =
    status === "success" ? { background: "#16a34a" } :
    status === "failed"  ? { background: "#dc2626" } :
    { background: "#d97706" };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${status === "running" ? "animate-pulse" : ""}`}
      style={style}
    />
  );
}

function RunRow({ run }: { run: PipelineRun }) {
  const [open, setOpen] = useState(false);
  const stages = run.stage_results ?? {};

  return (
    <>
      <tr
        className="cursor-pointer border-t border-zinc-100 hover:bg-zinc-50"
        onClick={() => setOpen((v) => !v)}
      >
        <td className="py-2.5 pl-4 pr-2">
          <span className="flex items-center gap-2">
            <StatusDot status={run.status} />
            <span className="text-xs font-medium capitalize text-zinc-700">{run.status}</span>
          </span>
        </td>
        <td className="px-2 py-2.5 text-xs text-zinc-600">{fmtDate(run.started_at)}</td>
        <td className="px-2 py-2.5 text-xs text-zinc-600">
          {run.total_elapsed_sec != null ? fmt(run.total_elapsed_sec) : run.finished_at ? "—" : "运行中…"}
        </td>
        <td className="px-2 py-2.5 text-xs text-zinc-500">{run.triggered_by ?? "—"}</td>
        <td className="py-2.5 pl-2 pr-4 text-xs text-zinc-400">{open ? "▲" : "▼"}</td>
      </tr>

      {open && (
        <tr className="border-t border-zinc-100 bg-zinc-50/60">
          <td colSpan={5} className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {STAGE_ORDER.map((key) => {
                const s = stages[key];
                if (!s) return null;
                const ok = s.status === "ok";
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs ${
                      ok
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {ok ? "✓" : "✗"} {STAGE_LABEL[key] ?? key}
                    <span className="font-mono text-[10px] opacity-70">{fmt(s.elapsed_sec)}</span>
                  </span>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function PipelineRunsClient() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<PipelineRun[]>("/api/pipeline-runs?limit=30");
      setRuns(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-light"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--sp-navy)" }}
        >
          Pipeline Runs
        </h1>
        <p className="mt-0.5 text-sm text-zinc-400">最近 30 次 · 每 30 秒自动刷新</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-zinc-100" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">Error: {error}</p>
      ) : runs.length === 0 ? (
        <p className="text-sm text-zinc-500">暂无运行记录。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2 pl-4 pr-2 text-xs font-medium text-zinc-500">状态</th>
                <th className="px-2 py-2 text-xs font-medium text-zinc-500">开始时间（北京）</th>
                <th className="px-2 py-2 text-xs font-medium text-zinc-500">耗时</th>
                <th className="px-2 py-2 text-xs font-medium text-zinc-500">触发方式</th>
                <th className="py-2 pl-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <RunRow key={run.id} run={run} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
