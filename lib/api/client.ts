/**
 * Base API client for the FastAPI backend.
 *
 * Set NEXT_PUBLIC_API_URL in your .env.local to point at the backend.
 * Falls back to http://localhost:8000 for local development.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

/** Read the admin JWT from the non-httpOnly cookie set after admin login. */
function getAdminJwt(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)admin_jwt=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Same as apiFetch but attaches the admin JWT as a Bearer token.
 * Use this for all /api/admin/* endpoints that require authentication.
 */
export async function apiFetchAdmin<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getAdminJwt();
  return apiFetch<T>(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });
}
