import crypto from "crypto";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const JWT_COOKIE = "admin_jwt";
const COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// HMAC-signed session token — never stores the plaintext password in cookie
// ---------------------------------------------------------------------------
function createSessionToken(secret: string): string {
  const expires = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = `admin:${expires}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string, secret: string): boolean {
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex")))
      return false;
  } catch {
    return false;
  }
  const parts = payload.split(":");
  const expires = parseInt(parts[1] ?? "0", 10);
  return Date.now() < expires;
}

// ---------------------------------------------------------------------------
// POST /api/admin-auth  — login
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 503 });
  }

  if (!password || password !== secret) {
    // Fixed delay to slow brute-force at the Next.js layer
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Store a signed token — NOT the plaintext password
  res.cookies.set(SESSION_COOKIE, createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Obtain FastAPI JWT for authenticated /api/admin/* calls.
  // Stored httpOnly — JS cannot read it; the proxy route attaches it server-side.
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
      res.cookies.set(JWT_COOKIE, access_token, {
        httpOnly: true,   // XSS cannot read this — proxy route reads it server-side
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }
  } catch {
    // Non-fatal: admin UI continues working, protected endpoints return 401
  }

  return res;
}

// ---------------------------------------------------------------------------
// DELETE /api/admin-auth  — logout
// ---------------------------------------------------------------------------
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(JWT_COOKIE);
  return res;
}

// ---------------------------------------------------------------------------
// Export verifySessionToken for use in Next.js middleware
// ---------------------------------------------------------------------------
export { verifySessionToken };
