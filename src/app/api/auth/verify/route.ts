import { ApiHandler } from "@/@types/api";
import pbClient, { pbAdminClient } from "@/client/pbClient";
import { NextResponse } from "next/server";
import { VerifyOTPRequestPayload } from "./verify.schema";
import { withVerifyValidator } from "./validator";
import { Context } from "@/@types/pocketbase";
import setAccessToken from "@/utils/setAcessToken";
import { isValidOtpForTestEmail } from "@/helpers/getTestUsers";

const verifyHandler: ApiHandler = async (req, context: Context) => {
  const pbAdmin = await pbAdminClient();
  const pb = await pbClient();
  const body = await req.json();
  const { otpId, password, httpOnly, email } = body as VerifyOTPRequestPayload;
  const result = await isValidOtpForTestEmail({
    client: pbAdmin,
    email,
    otp: password,
  });
  if (result) {
    console.log("ok");
  }
  const res = await pb.collection("users").authWithOTP(otpId, password);

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

export const POST = withVerifyValidator(verifyHandler);
