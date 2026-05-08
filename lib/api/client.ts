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

/**
 * Fetch a protected /api/admin/* endpoint via the Next.js server-side proxy.
 * The proxy reads the httpOnly admin_jwt cookie and attaches the Bearer token —
 * JS never has direct access to the JWT (XSS-safe).
 *
 * Pass the FastAPI path as the first argument, e.g. "/api/admin/stats".
 * Additional query params in `path` are forwarded automatically.
 */
export async function apiFetchAdmin<T>(path: string): Promise<T> {
  // Split path and query string
  const [pathname, qs] = path.split("?");
  const proxyUrl = `/api/admin-proxy?path=${encodeURIComponent(pathname)}${qs ? `&${qs}` : ""}`;

  const res = await fetch(proxyUrl, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}
