"use client";

import { SourceChannelBadge } from "@/components/digest/source-channel-badge";
import { useI18n } from "@/lib/i18n";
import { archiveChannelHref } from "@/lib/utils/archive-url";
import type { SourceChannel } from "@/types/source";

type ChannelCount = { channel: SourceChannel; count: number };

type IngestChannelRowProps = {
  visibleChannels: ChannelCount[];
  extraTypeCount: number;
  className?: string;
};

export function IngestChannelRow({
  visibleChannels,
  extraTypeCount,
  className = "",
}: IngestChannelRowProps) {
  const { t } = useI18n();

  if (visibleChannels.length === 0) return null;

  return (
    <ul
      className={`flex list-none flex-wrap gap-1.5 p-0 sm:gap-2 ${className}`.trim()}
      aria-label={t.digest.ingestChannelsAria}
    >
      {visibleChannels.map(({ channel, count }) => (
        <li key={channel}>
          <SourceChannelBadge
            channel={channel}
            count={count}
            href={archiveChannelHref(channel)}
          />
        </li>
      ))}
      {extraTypeCount > 0 ? (
        <li>
          <span
            className="inline-flex items-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-500"
            title={t.digest.formatMoreChannelTypesHidden(extraTypeCount)}
          >
            +{extraTypeCount}
          </span>
        </li>
      ) : null}
    </ul>
  );
}
