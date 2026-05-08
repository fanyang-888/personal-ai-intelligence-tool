export function Ticker() {
  const items = [
    "ANTHROPIC · Claude models leading reasoning benchmarks",
    "OPENAI · GPT-5 scores 96.3% on MMLU benchmark",
    "GOOGLE · Gemini Ultra outperforms on coding tasks",
    "META · Llama open weights released under permissive license",
    "MISTRAL · Mixture-of-experts model drops inference cost",
    "ARXIV · Speculative decoding cuts inference latency by 3.2×",
  ];
  const repeated = [...items, ...items];

  return (
    <div
      style={{
        background: "var(--accent)",
        color: "var(--ticker-text)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: ".06em",
        padding: "6px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: "inline-block",
          animation: "ticker-scroll 50s linear infinite",
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} style={{ margin: "0 40px" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
