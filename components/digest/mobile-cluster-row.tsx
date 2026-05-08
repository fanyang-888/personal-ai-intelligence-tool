"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { pickLocalized } from "@/lib/utils/localized-string";
import { formatRelevancePercent } from "@/lib/utils/cluster-sources";
import type { Cluster } from "@/types/cluster";

export function MobileClusterRow({ cluster }: { cluster: Cluster }) {
  const { lang } = useI18n();
  const tag = cluster.tags?.[0] ?? cluster.theme ?? "";
  const score = cluster.clusterScore ?? 0;
  const pct = Math.min(100, Math.max(0, score));
  const relevance = formatRelevancePercent(cluster.clusterScore);
  const sourceCount = cluster.articleIds.length;

  return (
    <Link
      href={`/cluster/${cluster.id}`}
      className="flex items-start gap-3 py-3 border-b [border-color:var(--border)] no-underline"
    >
      <div className="flex-1 min-w-0">
        {tag ? (
          <p
            className="mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              opacity: 0.7,
            }}
          >
            {tag}
          </p>
        ) : null}
        <p
          className="mb-1.5 leading-snug font-semibold"
          style={{ fontSize: 14, color: "var(--text)" }}
        >
          {pickLocalized(cluster.title, lang)}
        </p>
        <div
          className="flex items-center gap-1.5"
          style={{ fontSize: 11, color: "var(--text-muted)" }}
        >
          <span>{sourceCount} source{sourceCount !== 1 ? "s" : ""}</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <div
              style={{
                width: 26, height: 3,
                background: "var(--border)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: "var(--accent)",
                  borderRadius: 99,
                }}
              />
            </div>
            <span>{relevance}</span>
          </div>
        </div>
      </div>
      <span style={{ color: "var(--text-dim)", fontSize: 18, flexShrink: 0, paddingTop: 2, lineHeight: 1 }}>›</span>
    </Link>
  );
}
