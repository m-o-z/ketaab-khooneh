import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
      Match all paths except:
        - /_next (and all subpaths)
        - /favicon.ico
    */
    "/((?!_next/|favicon\\.ico|favicon|icons|manifest.json|splashs|sw.js|fonts|api/|startup.js).*)",
  ],
};

export function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const path = request.nextUrl.pathname;
  const hasAccessToken = request.cookies.has("accessToken");
  if (path === "/auth/login" && hasAccessToken) {
    return NextResponse.redirect(new URL("/books", request.url));
  }
  if (!hasAccessToken && !path.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (path.startsWith("/books")) {
    return NextResponse.next();
  }
  if (path === "/") {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  return NextResponse.next();
}
