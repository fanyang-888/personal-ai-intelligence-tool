/**
 * Server-side proxy for authenticated FastAPI admin endpoints.
 *
 * The admin JWT is stored in a httpOnly cookie (not readable by JS).
 * This route reads it server-side and forwards requests to FastAPI
 * with the Bearer token attached.
 *
 * Usage from admin client components:
 *   fetch("/api/admin-proxy?path=/api/admin/stats")
 *   fetch("/api/admin-proxy?path=/api/admin/sources")
 *   fetch("/api/admin-proxy?path=/api/admin/articles?limit=50")
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

async function proxyToFastAPI(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("admin_jwt")?.value;

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The target path is passed as a query param, e.g. ?path=/api/admin/stats
  const url = new URL(request.url);
  const targetPath = url.searchParams.get("path");
  if (!targetPath || !targetPath.startsWith("/api/admin/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Preserve any additional query params (e.g. limit, offset, source_id)
  const forwardParams = new URLSearchParams(url.searchParams);
  forwardParams.delete("path");
  const queryString = forwardParams.toString();
  const targetUrl = `${API_BASE}${targetPath}${queryString ? `?${queryString}` : ""}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export const GET = proxyToFastAPI;
