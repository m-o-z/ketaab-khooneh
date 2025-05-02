import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { NextResponse } from "next/server";
import { LoginRequestPayload } from "./login.schema";
import { withLoginValidator } from "./validator";

// pbClient.collection("users").authWithPassword(email, password)
const loginHandler: ApiHandler = async (req, context) => {
  const body = await req.json();
  const { password, username, httpOnly } = body as LoginRequestPayload;
  const res = await pbClient
    .collection("users")
    .authWithPassword(username, password);

  const response = NextResponse.json({
    token: res.token,
    record: res.record,
  });
  const origin = new URL(req.headers.get("origin") ?? "http://localhost");

  if (httpOnly) {
    response.cookies.set("accessToken", res.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      domain: origin.hostname,
      path: "/",
    });
  }

  return response;
};

export const POST = withLoginValidator(loginHandler);
