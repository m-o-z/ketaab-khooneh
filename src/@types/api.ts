import { NextRequest, NextResponse } from "next/server";

export type ApiHandler = (
  request: NextRequest,
  context: any, // Context might contain params like { params: { slug: '...' } }
  userData?: any, // Optional: Pass user data down
) => Promise<NextResponse> | NextResponse | Response | Promise<Response>;
