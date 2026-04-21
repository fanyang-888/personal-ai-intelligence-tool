/**
 * Thin colored progress bar visualising a cluster's signal score (0–100).
 * High ≥ 70 → emerald · Mid 40–69 → amber · Low < 40 → zinc
 */
type ScoreBarProps = {
  score?: number | null;
  className?: string;
};

export function ScoreBar({ score, className = "" }: ScoreBarProps) {
  if (score == null || score <= 0) return null;

  const pct = Math.min(100, Math.max(0, score));
  const barColorStyle =
    pct >= 70
      ? "var(--sp-accent-mid)"
      : pct >= 40
        ? "var(--sp-accent)"
        : "#d1d5db";

  const label =
    pct >= 70 ? "High signal" : pct >= 40 ? "Mid signal" : "Low signal";

  return (
    <div className={`mt-3 flex items-center gap-2 ${className}`}>
      <span className="shrink-0 text-[10px] text-zinc-400">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColorStyle }}
        />
      </div>
      <span className="w-6 shrink-0 text-right font-mono text-[10px] tabular-nums text-zinc-400">
        {Math.round(pct)}
      </span>
    </div>
  );
}
