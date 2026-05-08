/**
 * Client-side event tracking — fire-and-forget.
 * Calls POST /api/events; silently swallows all errors.
 */

type EventType =
  | "draft_copied"
  | "draft_shared_linkedin"
  | "draft_shared_x"
  | "cluster_viewed"
  | "draft_viewed";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ?? "http://localhost:8000";

export function trackEvent(type: EventType, entityId: string): void {
  // Fire-and-forget — POST directly to FastAPI, never throws
  fetch(`${API_BASE}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, entity_id: entityId }),
  }).catch(() => {
    // silently ignore network errors
  });
}
