import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
      Match all paths except:
        - /_next (and all subpaths)
        - /favicon.ico
    */
    "/((?!_next/|favicon\\.ico|api/).*)",
  ],
};

export function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const path = request.nextUrl.pathname;
  const hasAccessToken = request.cookies.has("accessToken");
  if (path === "/login" && hasAccessToken) {
    return NextResponse.redirect(new URL("/books", request.url));
  } else if (!hasAccessToken && path != "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    if (path.startsWith("/books")) {
      return NextResponse.next();
    } else if (path === "/") {
      return NextResponse.redirect(new URL("/books", request.url));
    }
  }

  return NextResponse.next();
}
