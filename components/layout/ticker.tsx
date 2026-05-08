export function Ticker() {
  const items = [
    "ANTHROPIC · Leading reasoning benchmarks across all major evaluations",
    "OPENAI · GPT-5 scores 96.3% on MMLU benchmark",
    "GOOGLE · Gemini Ultra outperforms on multimodal coding tasks",
    "META · Llama open weights released under permissive license",
    "MISTRAL · Mixture-of-experts model drops inference cost by 40%",
    "ARXIV · Speculative decoding cuts inference latency by 3.2×",
  ];
  const doubled = [...items, ...items];

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
        {doubled.map((item, i) => (
          <span key={i} style={{ margin: "0 40px" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
