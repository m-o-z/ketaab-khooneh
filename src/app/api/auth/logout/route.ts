import { NextRequest, NextResponse } from "next/server";

import { ApiHandler } from "@/@types/api";
import { withAuth } from "@/middlewares/withAuth";
import { errorBadRequest } from "@/utils/errors/errors";
import { isPocketBaseError } from "@/utils/pocketbase";
import { createResponsePayload } from "@/utils/response";

const createLogoutResponse = (req: NextRequest) => {
  const response = NextResponse.json(
    createResponsePayload("You have logged out."),
    { status: 201 },
  );

  const headerOrigin = req.headers.get("origin");
  console.log({ headerOrigin, headerOriginType: typeof headerOrigin });

  const requestOrigin = headerOrigin || "http://localhost:3000";
  const originHost = new URL(requestOrigin).hostname;

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    domain: originHost,
    path: "/",
  });

  return response;
};

const loginHandler: ApiHandler = (req: NextRequest, context) => {
  const response = createLogoutResponse(req);

  try {
    void context.pb.authStore?.clear();

    return response;
  } catch (e) {
    if (isPocketBaseError(e) && e.status === 401) {
      return createLogoutResponse(req);
    }
    return errorBadRequest();
  }
};

export const POST = withAuth(loginHandler);
