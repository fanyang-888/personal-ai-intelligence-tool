"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

type SourceRow = {
  id: string;
  slug: string | null;
  name: string;
  type: string;
  is_active: boolean;
  fetch_frequency_minutes: number;
  last_polled_at: string | null;
  etag: string | null;
  article_count: number;
  articles_last_7d: number;
};

function fmtAgo(iso: string | null): string {
  if (!iso) return "从未";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 2) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

const TYPE_LABEL: Record<string, string> = {
  company_news: "官方",
  tech_press: "科技媒体",
  newsletter: "通讯",
  research: "学术",
};

export function SourcesClient() {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SourceRow[]>("/api/admin/sources")
      .then(setSources)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-light"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--sp-navy)" }}
        >
          信源监控
        </h1>
        <p className="mt-0.5 text-sm text-zinc-400">各信源抓取状态及文章量</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-zinc-100" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">加载失败：{error}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2.5 pl-4 pr-2 text-xs font-medium text-zinc-500">信源</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">类型</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">状态</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">最后抓取</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">频率</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">近 7 天</th>
                <th className="px-2 py-2.5 pr-4 text-xs font-medium text-zinc-500">总计</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => {
                const stale = src.last_polled_at
                  ? Date.now() - new Date(src.last_polled_at).getTime() > src.fetch_frequency_minutes * 60 * 1000 * 3
                  : true;
                return (
                  <tr key={src.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 pl-4 pr-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-800">{src.name}</span>
                        {src.slug && (
                          <Link
                            href={`/admin/articles?source_id=${src.id}`}
                            className="text-xs text-zinc-400 hover:underline"
                          >
                            {src.slug}
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-zinc-500">
                      {TYPE_LABEL[src.type] ?? src.type}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          src.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${src.is_active ? "bg-emerald-500" : "bg-zinc-400"}`} />
                        {src.is_active ? "活跃" : "停用"}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs" style={{ color: stale && src.is_active ? "#dc2626" : "#71717a" }}>
                      {fmtAgo(src.last_polled_at)}
                    </td>
                    <td className="px-2 py-3 text-xs text-zinc-500">
                      每 {src.fetch_frequency_minutes >= 1440
                        ? `${src.fetch_frequency_minutes / 1440} 天`
                        : `${src.fetch_frequency_minutes} 分钟`}
                    </td>
                    <td className="px-2 py-3 text-sm font-medium" style={{ color: "var(--sp-accent-mid)" }}>
                      {src.articles_last_7d}
                    </td>
                    <td className="px-2 py-3 pr-4 text-sm text-zinc-600 tabular-nums">
                      {src.article_count.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
