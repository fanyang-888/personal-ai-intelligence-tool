/**
 * Public API layer — all backend calls go through here.
 * Components import from "@/lib/api" and never call fetch directly.
 */

import { apiFetch } from "./client";
import type {
  ApiCluster,
  ApiDigest,
  ApiDraft,
  ApiSearchResponse,
} from "./types";

// ---------------------------------------------------------------------------
// Digest
// ---------------------------------------------------------------------------

export async function fetchTodayDigest(): Promise<ApiDigest> {
  return apiFetch<ApiDigest>("/api/digest/today");
}

// ---------------------------------------------------------------------------
// Clusters
// ---------------------------------------------------------------------------

export async function fetchClusters(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiCluster[]> {
  const qs = new URLSearchParams();
  if (params?.limit != null) qs.set("limit", String(params.limit));
  if (params?.offset != null) qs.set("offset", String(params.offset));
  const q = qs.toString();
  return apiFetch<ApiCluster[]>(`/api/clusters${q ? `?${q}` : ""}`);
}

export async function fetchCluster(id: string): Promise<ApiCluster> {
  return apiFetch<ApiCluster>(`/api/clusters/${id}`);
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export async function fetchSearch(params: {
  q?: string;
  source?: string;
  theme?: string;
  type?: "cluster" | "article" | "mixed";
  limit?: number;
  offset?: number;
  sortBy?: "score" | "date";
}): Promise<ApiSearchResponse> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.source) qs.set("source", params.source);
  if (params.theme) qs.set("theme", params.theme);
  if (params.type) qs.set("type", params.type);
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.offset != null && params.offset > 0) qs.set("offset", String(params.offset));
  if (params.sortBy && params.sortBy !== "score") qs.set("sort_by", params.sortBy);
  return apiFetch<ApiSearchResponse>(`/api/search?${qs.toString()}`);
}

// ---------------------------------------------------------------------------
// Drafts
// ---------------------------------------------------------------------------

export async function fetchTodayDraft(): Promise<ApiDraft | null> {
  return apiFetch<ApiDraft | null>("/api/drafts/today");
}

export async function fetchDraft(id: string, role?: string): Promise<ApiDraft> {
  const qs = role ? `?role=${encodeURIComponent(role)}` : "";
  return apiFetch<ApiDraft>(`/api/drafts/${id}${qs}`);
}

// Re-export types for convenience
export type { ApiCluster, ApiDigest, ApiDraft, ApiSearchResponse } from "./types";
