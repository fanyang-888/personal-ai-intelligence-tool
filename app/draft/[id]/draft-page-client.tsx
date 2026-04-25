"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DraftPageView } from "@/components/draft/draft-page-view";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { fetchDraft } from "@/lib/api";
import { apiDraftToDraft } from "@/lib/api/mappers";
import { useI18n } from "@/lib/i18n";
import type { Draft } from "@/types/draft";
import type { LocalizedString } from "@/types/localized";

type Role = "pm" | "developer" | "student" | null;

const ROLES: { value: Role; labelKey: "audiencePm" | "audienceDeveloper" | "audienceStudent" | null }[] = [
  { value: null, labelKey: null },
  { value: "pm", labelKey: "audiencePm" },
  { value: "developer", labelKey: "audienceDeveloper" },
  { value: "student", labelKey: "audienceStudent" },
];

function RoleTabs({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  const { t } = useI18n();
  const base =
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
  const active = "bg-white text-foreground shadow-sm";
  const idle = "text-zinc-600 hover:text-foreground";

  const labels: Record<string, string> = {
    audiencePm: t.cluster.audiencePm,
    audienceDeveloper: t.cluster.audienceDeveloper,
    audienceStudent: t.cluster.audienceStudent,
  };

  return (
    <div className="mb-6" role="radiogroup" aria-label="Personalize for role">
      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-1 gap-0.5">
        {ROLES.map(({ value: v, labelKey }) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={value === v}
            className={`${base} ${value === v ? active : idle}`}
            onClick={() => onChange(v)}
          >
            {labelKey ? labels[labelKey] : t.draft.roleGeneral}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DraftPageClient() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const [role, setRole] = useState<Role>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [clusterTitle, setClusterTitle] = useState<LocalizedString>({ en: "", zh: "" });
  const [clusterSummary, setClusterSummary] = useState<LocalizedString>({ en: "", zh: "" });
  const [clusterTags, setClusterTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(draftId: string, currentRole: Role) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDraft(draftId, currentRole ?? undefined);
      setDraft(apiDraftToDraft(data));
      setClusterTitle({ en: data.title.en, zh: data.title.zh ?? "" });
      setClusterSummary({ en: "", zh: "" });
      setClusterTags([]);
    } catch (e) {
      setError((e as Error).message ?? t.notFound.draftTitle);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load(id, role);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  if (loading) return <LoadingState layout="detail" />;

  if (error || !draft) {
    return (
      <ErrorState
        title={t.notFound.draftTitle}
        message={error ?? t.notFound.draftMessage}
        onRetry={() => id && load(id, role)}
      />
    );
  }

  return (
    <>
      <RoleTabs value={role} onChange={setRole} />
      <DraftPageView
        draft={draft}
        isDraftOfDay={false}
        clusterId={draft.clusterId}
        clusterTitle={clusterTitle}
        clusterExists={!!draft.clusterId}
        clusterSummary={clusterSummary}
        clusterTags={clusterTags}
      />
    </>
  );
}
