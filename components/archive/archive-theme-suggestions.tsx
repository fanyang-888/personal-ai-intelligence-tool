"use client";

import { useI18n } from "@/lib/i18n";
import { TOPIC_GROUPS, topicGroupLabel } from "@/lib/constants/topic-groups";

type ArchiveTopicSuggestionsProps = {
  onPickTopic: (topicKey: string) => void;
};

export function ArchiveThemeSuggestions({
  onPickTopic,
}: ArchiveTopicSuggestionsProps) {
  const { t, lang } = useI18n();

  return (
    <div className="text-center">
      <p className="text-sm [color:var(--text-muted)]">{t.archive.suggestThemesLead}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {TOPIC_GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => onPickTopic(g.key)}
            className="rounded-full border [border-color:var(--border)] [background:var(--surface)] px-3 py-1.5 text-sm [color:var(--text-muted)] transition-colors hover:border-emerald-600/50 hover:bg-emerald-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            {topicGroupLabel(g, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}
