import { NextRequest, NextResponse } from "next/server";

import { ApiErrorResponse } from "@/utils/response";
import { MaybePromise } from "@/utils/type";

import { Context } from "./pocketbase";

export type ApiHandler = (
  request: NextRequest,
  context: Context, // Context might contain params like { params: { slug: '...' } }
  userData?: any, // Optional: Pass user data down
) =>
  | MaybePromise<NextResponse>
  | MaybePromise<Response>
  | MaybePromise<ApiErrorResponse>;
