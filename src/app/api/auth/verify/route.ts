import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { NextResponse } from "next/server";
import { VerifyOTPRequestPayload } from "./verify.schema";
import { withLoginValidator } from "./validator";
import { Context } from "@/@types/pocketbase";
import setAccessToken from "@/utils/setAcessToken";

const loginHandler: ApiHandler = async (req, context: Context) => {
  const body = await req.json();
  const { otpId, password, httpOnly } = body as VerifyOTPRequestPayload;
  const res = await pbClient().collection("users").authWithOTP(otpId, password);

  const response = NextResponse.json({
    token: res.token,
    record: res.record,
  });

  const origin = new URL(req.headers.get("origin") ?? "http://localhost")
    .hostname;

  if (httpOnly) {
    setAccessToken({
      origin: origin,
      token: res.token,
      response,
    });
  }

  return response;
};

export const POST = withLoginValidator(loginHandler);
