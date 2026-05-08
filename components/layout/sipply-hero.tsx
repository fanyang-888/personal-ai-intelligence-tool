"use client";

export function SippyHero({ dateLabel }: { dateLabel: string }) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        paddingBottom: "16px",
        marginBottom: "40px",
        display: "flex",
        alignItems: "baseline",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          fontWeight: 500,
        }}
      >
        Intelligence Brief
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
          letterSpacing: ".05em",
        }}
      >
        {dateLabel}
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: "var(--green)",
          letterSpacing: ".08em",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--green)",
            animation: "sp-pulse 2s infinite",
          }}
        />
        Pipeline live
      </span>
    </div>
  );
}
