export function SippyHero({ dateLabel }: { dateLabel: string }) {
  return (
    <div
      style={{
        background: "var(--sp-navy)",
        borderBottom: "1px solid var(--sp-navy-light)",
      }}
      className="px-4 py-5 sm:px-9 sm:py-12 grid gap-6 sm:grid-cols-[1fr_200px] items-center"
    >
      {/* Text */}
      <div>
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#4a9bbf",
            marginBottom: "10px",
            fontWeight: 400,
          }}
        >
          Your intelligence briefing · {dateLabel}
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            lineHeight: 1.18,
            color: "#d4edf8",
            marginBottom: "10px",
          }}
          className="text-2xl sm:text-[clamp(28px,4vw,38px)]"
        >
          Knowledge, distilled
          <br />
          into{" "}
          <em style={{ fontStyle: "italic", color: "#5dc8f5" }}>every sip</em>
        </h1>
        <p style={{ fontSize: "12px", color: "#4a8aaa", lineHeight: 1.65, maxWidth: "380px" }}>
          AI-curated insights served fresh — drink in what matters, set aside the rest.
        </p>
      </div>

      {/* Animated water cup — desktop only */}
      <div className="hidden sm:flex justify-center items-end pb-2">
        <svg width="120" height="148" viewBox="0 0 120 148" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="cupClipHero">
              <path d="M22 38 Q20 38 19 50 L12 126 Q11 136 24 138 L96 138 Q109 136 108 126 L101 50 Q100 38 98 38 Z" />
            </clipPath>
          </defs>
          <path
            d="M22 38 Q20 38 19 50 L12 126 Q11 136 24 138 L96 138 Q109 136 108 126 L101 50 Q100 38 98 38 Z"
            fill="#163f5c" stroke="#2a6a96" strokeWidth="1.5"
          />
          <g clipPath="url(#cupClipHero)">
            <g style={{ animation: "sp-fillup 3s ease-in-out infinite alternate" }}>
              <rect x="10" y="88" width="100" height="60" fill="#1a7aad" />
              <ellipse cx="60" cy="88" rx="28" ry="5" fill="#2e96cc"
                style={{ animation: "sp-ripple 3s ease-in-out infinite alternate" }} />
              <ellipse cx="60" cy="88" rx="14" ry="2.5" fill="#5dc8f5" />
            </g>
          </g>
          <path
            d="M22 38 Q20 38 19 50 L12 126 Q11 136 24 138 L96 138 Q109 136 108 126 L101 50 Q100 38 98 38 Z"
            fill="none" stroke="#2a6a96" strokeWidth="1.5"
          />
          <path d="M22 38 L98 38" stroke="#2a6a96" strokeWidth="1" />
          <rect x="76" y="26" width="1" height="14" rx="0.5" fill="#2a6a96" />
          <ellipse cx="60" cy="24" rx="10" ry="4" fill="none" stroke="#2a6a96" strokeWidth="1" />
          <line x1="50" y1="24" x2="50" y2="30" stroke="#2a6a96" strokeWidth="1" />
          <line x1="70" y1="24" x2="70" y2="30" stroke="#2a6a96" strokeWidth="1" />
          <path d="M55 18 Q60 12 65 18" fill="none" stroke="#3a8ab8" strokeWidth="1" strokeLinecap="round" />
          <circle cx="60" cy="9" r="2.5" fill="#5dc8f5" />
        </svg>
      </div>
    </div>
  );
}
