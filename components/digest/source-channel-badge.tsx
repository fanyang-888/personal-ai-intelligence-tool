import { SOURCE_CHANNEL_LABEL } from "@/lib/utils/cluster-sources";
import type { SourceChannel } from "@/types/source";

function ChannelIcon({ channel }: { channel: SourceChannel }) {
  const cls = "h-3.5 w-3.5 shrink-0 text-zinc-600";
  switch (channel) {
    case "email":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 3.5h12v9H2v-9Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2 4.5 8 9l6-4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "chat":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6l-2.5 2v-2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "feed":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            fill="currentColor"
          />
          <path
            d="M3 5v2a6 6 0 0 1 6 6h2A8 8 0 0 0 3 5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M3 2v2a10 10 0 0 1 10 10h2A12 12 0 0 0 3 2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "web":
    default:
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle
            cx="8"
            cy="8"
            r="6.25"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M2 8h12M8 2a9 9 0 0 1 0 12 9 9 0 0 1 0-12Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

type SourceChannelBadgeProps = {
  channel: SourceChannel;
  count: number;
};

/**
 * Distinct from {@link StoryBadge}: icon + numeric count for ingest channel transparency.
 */
export function SourceChannelBadge({ channel, count }: SourceChannelBadgeProps) {
  const label = SOURCE_CHANNEL_LABEL[channel];
  const aria = `${count} source${count === 1 ? "" : "s"} from ${label}`;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-700 shadow-sm"
      title={aria}
      role="img"
      aria-label={aria}
    >
      <ChannelIcon channel={channel} />
      <span aria-hidden className="text-zinc-500">
        {label}
      </span>
      <span aria-hidden className="min-w-[1ch] text-zinc-800">
        ×{count}
      </span>
    </span>
  );
}
