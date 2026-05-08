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
      className={`flex list-none flex-wrap gap-1.5 p-0 sm:gap-2 max-[380px]:-mx-0.5 max-[380px]:flex-nowrap max-[380px]:gap-1 max-[380px]:overflow-x-auto max-[380px]:pb-1 max-[380px]:[scrollbar-width:thin] ${className}`.trim()}
      aria-label={t.digest.ingestChannelsAria}
    >
      {visibleChannels.map(({ channel, count }) => (
        <li key={channel} className="shrink-0">
          <SourceChannelBadge
            channel={channel}
            count={count}
            href={archiveChannelHref(channel)}
          />
        </li>
      ))}
      {extraTypeCount > 0 ? (
        <li className="shrink-0">
          <span
            className="inline-flex items-center rounded-md border border-dashed [border-color:var(--border)] [background:var(--surface2)] px-2 py-0.5 text-xs font-medium tabular-nums [color:var(--text-muted)]"
            title={t.digest.formatMoreChannelTypesHidden(extraTypeCount)}
          >
            +{extraTypeCount}
          </span>
        </li>
      ) : null}
    </ul>
  );
}
