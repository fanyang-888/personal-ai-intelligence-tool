"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DraftPageView } from "@/components/draft/draft-page-view";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { fetchDraft, regenerateDraft } from "@/lib/api";
import { apiDraftToDraft } from "@/lib/api/mappers";
import type { Draft } from "@/types/draft";
import type { LocalizedString } from "@/types/localized";

export function DraftPageClient() {
  const { id } = useParams<{ id: string }>();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [clusterTitle, setClusterTitle] = useState<LocalizedString>({ en: "", zh: "" });
  const [clusterSummary, setClusterSummary] = useState<string>("");
  const [clusterTags, setClusterTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(draftId: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDraft(draftId);
      setDraft(apiDraftToDraft(data));
      setClusterTitle({ en: data.title.en, zh: data.title.zh ?? "" });
      setClusterTags([]);
      setClusterSummary("");
    } catch (e) {
      setError((e as Error).message ?? "Draft not found");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load(id);
  }, [id]);

  async function handleRegenerate() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await regenerateDraft(id);
      setDraft(apiDraftToDraft(data));
    } catch (e) {
      setError((e as Error).message ?? "Regeneration failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState layout="detail" />;

  if (error || !draft) {
    return (
      <ErrorState
        title="Draft not found"
        message={error ?? "This draft does not exist or could not be loaded."}
        onRetry={() => id && load(id)}
      />
    );
  }

  return (
    <DraftPageView
      draft={draft}
      isDraftOfDay={false}
      clusterId={draft.clusterId}
      clusterTitle={clusterTitle}
      clusterExists={!!draft.clusterId}
      clusterSummary={clusterSummary}
      clusterTags={clusterTags}
    />
  );
}
