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
          {/* Cup body */}
          <path
            d="M22 38 Q20 38 19 50 L12 126 Q11 136 24 138 L96 138 Q109 136 108 126 L101 50 Q100 38 98 38 Z"
            fill="#163f5c" stroke="#2a6a96" strokeWidth="1.5"
          />
          {/* Water fill — gentle sway */}
          <g clipPath="url(#cupClipHero)">
            <g style={{ animation: "sp-sway 5s ease-in-out infinite alternate" }}>
              <rect x="10" y="86" width="100" height="62" fill="#1a7aad" />
              {/* Surface highlights */}
              <ellipse cx="60" cy="86" rx="50" ry="5" fill="#1d85bc" />
              <ellipse cx="60" cy="86" rx="28" ry="3" fill="#2e96cc" />
              <ellipse cx="60" cy="86" rx="12" ry="1.5" fill="#5dc8f5" opacity="0.55" />
            </g>
          </g>
          {/* Cup outline overlay */}
          <path
            d="M22 38 Q20 38 19 50 L12 126 Q11 136 24 138 L96 138 Q109 136 108 126 L101 50 Q100 38 98 38 Z"
            fill="none" stroke="#2a6a96" strokeWidth="1.5"
          />
          <path d="M22 38 L98 38" stroke="#2a6a96" strokeWidth="1" />
          {/* Straw — single clean line */}
          <line x1="60" y1="6" x2="60" y2="38" stroke="#2a6a96" strokeWidth="1.5" strokeLinecap="round" />
          {/* Falling drop */}
          <circle cx="60" cy="6" r="3" fill="#5dc8f5"
            style={{ animation: "sp-drop 2.8s cubic-bezier(0.4,0,0.8,1) infinite" }} />
        </svg>
      </div>
    </div>
  );
}
