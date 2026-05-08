import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const JWT_COOKIE = "admin_jwt";
const COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 503 });
  }

  if (!password || password !== secret) {
    // Small fixed delay to slow brute-force attempts at the Next.js layer
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Session marker (httpOnly — can't be read by JS)
  res.cookies.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Also obtain a FastAPI JWT so the admin UI can call protected /api/admin/* endpoints.
  // ADMIN_USERNAME + ADMIN_PASSWORD must match the FastAPI env vars.
  // Falls back gracefully if FastAPI is unreachable.
  try {
    const username = process.env.ADMIN_USERNAME ?? "admin";
    const apiRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(5000),
    });
    if (apiRes.ok) {
      const { access_token } = (await apiRes.json()) as { access_token: string };
      // Readable by JS (non-httpOnly) so admin client components can attach it as Bearer
      res.cookies.set(JWT_COOKIE, access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }
  } catch {
    // Non-fatal: admin UI will still work for non-protected endpoints
  }

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(JWT_COOKIE);
  return res;
}
