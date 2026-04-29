"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTodayDraft } from "@/lib/api";
import { LoadingState } from "@/components/shared/loading-state";

export default function TodayDraftPage() {
  const router = useRouter();

  useEffect(() => {
    fetchTodayDraft()
      .then((d) => { if (d) router.replace(`/draft/${d.id}`); else router.replace("/"); })
      .catch(() => router.replace("/"));
  }, [router]);

  return <LoadingState layout="digest" />;
}
