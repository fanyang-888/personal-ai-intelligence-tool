import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";

/**
 * Lightweight route guard for /admin/* pages.
 * Checks for the presence of the httpOnly session cookie set by /api/admin-auth.
 * Real HMAC validation + JWT auth happens inside admin-proxy and FastAPI.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page to avoid redirect loop
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
