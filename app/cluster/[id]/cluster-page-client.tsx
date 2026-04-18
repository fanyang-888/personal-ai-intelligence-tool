"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClusterPageView } from "@/components/cluster/cluster-page-view";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { fetchCluster } from "@/lib/api";
import { apiClusterToCluster } from "@/lib/api/mappers";
import type { Cluster } from "@/types/cluster";

export function ClusterPageClient() {
  const { id } = useParams<{ id: string }>();

  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCluster(id);
        if (!cancelled) setCluster(apiClusterToCluster(data));
      } catch (e) {
        if (!cancelled)
          setError((e as Error).message ?? "Cluster not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingState layout="detail" />;

  if (error || !cluster) {
    return (
      <ErrorState
        title="Story not found"
        message={error ?? "This cluster does not exist or could not be loaded."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <ClusterPageView cluster={cluster} articles={cluster.articles ?? []} related={[]} />;
}
