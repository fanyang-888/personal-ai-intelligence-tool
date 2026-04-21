"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

type LocalizedStr = { en: string; zh?: string | null };

type DraftResponse = {
  id: string;
  clusterId: string | null;
  generatedAt: string | null;
  hook: LocalizedStr;
  summaryBlock: LocalizedStr;
  takeaways: LocalizedStr[];
  careerInterpretationBlock: LocalizedStr;
  closingBlock: LocalizedStr | null;
  fullText: string;
  title: LocalizedStr;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(iso));
}

function pick(field: LocalizedStr, zh: boolean) {
  return zh ? (field.zh ?? field.en) : field.en;
}

function DraftDetailPanel({ draft, onClose, zh }: { draft: DraftResponse; onClose: () => void; zh: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1" />
      <div
        className="w-full max-w-lg overflow-y-auto bg-white shadow-xl"
        style={{ borderLeft: "1px solid var(--sp-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--sp-border)" }}>
          <h2 className="text-base font-medium text-zinc-800">{zh ? "Draft 详情" : "Draft Details"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {[
            { label: zh ? "标题" : "Title", content: pick(draft.title, zh) },
            { label: "Hook", content: pick(draft.hook, zh) },
            { label: zh ? "摘要" : "Summary", content: pick(draft.summaryBlock, zh) },
          ].map(({ label, content }) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">{label}</p>
              <p className="text-sm text-zinc-700">{content}</p>
            </div>
          ))}

          {draft.takeaways.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">
                {zh ? "要点" : "Takeaways"}
              </p>
              <ul className="space-y-1">
                {draft.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-700">
                    <span className="shrink-0 text-zinc-400">{i + 1}.</span>
                    {pick(t, zh)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">
              {zh ? "职场解读" : "Career Take"}
            </p>
            <p className="text-sm text-zinc-700">{pick(draft.careerInterpretationBlock, zh)}</p>
          </div>

          {draft.closingBlock && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">
                {zh ? "结尾" : "Closing"}
              </p>
              <p className="text-sm text-zinc-700">{pick(draft.closingBlock, zh)}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {draft.clusterId && (
              <Link href={`/cluster/${draft.clusterId}`} target="_blank"
                className="rounded-md border px-3 py-1.5 text-xs transition-colors hover:bg-zinc-50"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-accent-mid)" }}>
                {zh ? "查看关联 Cluster →" : "View Cluster →"}
              </Link>
            )}
            <Link href={`/draft/${draft.id}`} target="_blank"
              className="rounded-md border px-3 py-1.5 text-xs transition-colors hover:bg-zinc-50"
              style={{ borderColor: "var(--sp-border)", color: "#3f3f46" }}>
              {zh ? "前台页面 →" : "Public page →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DraftsClient() {
  const { lang } = useI18n();
  const zh = lang === "zh";

  const [drafts, setDrafts] = useState<DraftResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DraftResponse | null>(null);

  useEffect(() => {
    apiFetch<{ id: string; draftId: string | null }[]>("/api/clusters?limit=50&offset=0")
      .then(async (clusters) => {
        const withDraft = clusters.filter((c) => c.draftId);
        const results = await Promise.all(
          withDraft.map((c) => apiFetch<DraftResponse>(`/api/drafts/${c.draftId}`).catch(() => null))
        );
        setDrafts(results.filter(Boolean) as DraftResponse[]);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-light" style={{ fontFamily: "'Fraunces', serif", color: "var(--sp-navy)" }}>
          Drafts
        </h1>
        <p className="mt-0.5 text-sm text-zinc-400">
          {zh ? `共 ${drafts.length} 篇 AI 生成草稿` : `${drafts.length} AI-generated drafts`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-md bg-zinc-100" />)}</div>
      ) : error ? (
        <p className="text-sm text-red-600">{zh ? "加载失败：" : "Failed: "}{error}</p>
      ) : drafts.length === 0 ? (
        <p className="text-sm text-zinc-400">{zh ? "暂无 Draft。" : "No drafts yet."}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2.5 pl-4 pr-2 text-xs font-medium text-zinc-500">{zh ? "标题" : "Title"}</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">{zh ? "Hook 预览" : "Hook preview"}</th>
                <th className="px-2 py-2.5 text-xs font-medium text-zinc-500">{zh ? "生成时间" : "Generated"}</th>
                <th className="px-2 py-2.5 pr-4 text-xs font-medium text-zinc-500" />
              </tr>
            </thead>
            <tbody>
              {drafts.map((d) => (
                <tr key={d.id} className="cursor-pointer border-t border-zinc-100 hover:bg-zinc-50" onClick={() => setSelected(d)}>
                  <td className="py-3 pl-4 pr-2 max-w-[200px]">
                    <p className="text-sm font-medium text-zinc-800 line-clamp-2">{pick(d.title, zh)}</p>
                  </td>
                  <td className="px-2 py-3 max-w-[280px]">
                    <p className="text-xs text-zinc-500 line-clamp-2">{pick(d.hook, zh)}</p>
                  </td>
                  <td className="px-2 py-3 text-xs text-zinc-400 whitespace-nowrap">{fmtDate(d.generatedAt)}</td>
                  <td className="px-2 py-3 pr-4">
                    <button onClick={(e) => { e.stopPropagation(); setSelected(d); }} className="text-xs" style={{ color: "var(--sp-accent-mid)" }}>
                      {zh ? "展开" : "Open"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <DraftDetailPanel draft={selected} onClose={() => setSelected(null)} zh={zh} />}
    </div>
  );
}
