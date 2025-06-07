import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { createResponsePayload } from "@/utils/response";
import { NextResponse } from "next/server";

const loginHandler: ApiHandler = async (req, context: Context) => {
  const response = NextResponse.json(
    createResponsePayload("You have logged out."),
    { status: 201 },
  );
  const requestOrigin = req.headers.get("origin") || "http://localhost:3000";
  const originHost = new URL(requestOrigin).hostname;

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    domain: originHost,
    path: "/",
  });

  context.pb.authStore.clear();

  return response;
};

export const POST = withAuth(loginHandler);
