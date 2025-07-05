import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";
import { isValidOtpForTestEmail } from "@/helpers/getTestUsers";
import { PocketBaseService } from "@/services/PocketBaseService";
import { UserInfo } from "@/types";
import setAccessToken from "@/utils/setAcessToken";
import { NextResponse } from "next/server";
import { RecordAuthResponse, RecordModel } from "pocketbase";
import { withVerifyValidator } from "./validator";
import { VerifyOTPRequestPayload } from "./verify.schema";

const verifyHandler: ApiHandler = async (req, context: Context) => {
  const instance = await PocketBaseService.GetInstance();
  const adminClient = instance.admin;
  const client = PocketBaseService.Client();
  const body = await req.json();
  const { otpId, password, httpOnly, email } = body as VerifyOTPRequestPayload;
  const result = await isValidOtpForTestEmail({
    client: adminClient,
    email,
    otp: password,
  });
  let res: RecordAuthResponse<RecordModel> = null!;
  if (result) {
    const testUser = await adminClient
      .collection<UserInfo>("users")
      .getFirstListItem(`email="${email}"`);
    res = await adminClient
      .collection("users")
      .authWithPassword(testUser.email, "random@12345");
  } else {
    res = await client.collection("users").authWithOTP(otpId, password);
  }

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
