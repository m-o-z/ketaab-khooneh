import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { NextResponse } from "next/server";
import { RequestOTPRequestPayload } from "./login.schema";
import { withLoginValidator } from "./validator";
import { Context } from "@/@types/pocketbase";

const loginHandler: ApiHandler = async (req, context: Context) => {
  const body = await req.json();
  const { email } = body as RequestOTPRequestPayload;
  const res = await pbClient().collection("users").requestOTP(email);

  const response = NextResponse.json({
    otpId: res.otpId,
  });

  return response;
};

export const POST = withLoginValidator(loginHandler);
