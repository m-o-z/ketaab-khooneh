import { NextRequest, NextResponse } from "next/server";

import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";
import { PocketBaseService } from "@/services/PocketBaseService";
import { errorBadRequest } from "@/utils/errors/errors";

import { RequestOTPRequestPayload } from "./login.schema";
import { withLoginValidator } from "./validator";

const loginHandler: ApiHandler = async (req: NextRequest, context: Context) => {
  const adminClient = await PocketBaseService.AdminClient();
  const body = (await req.json()) as RequestOTPRequestPayload;
  const { email } = body;
  let hasFirstItem = false;

  console.log({ email, body, adminClient });

  try {
    await adminClient.collection("users").getFirstListItem(`email="${email}"`);
    hasFirstItem = true;
  } catch (e) {
    console.log({ e1: e });
  }
  try {
    if (!hasFirstItem) {
      const data = {
        email,
        emailVisibility: true,
        password: "random@12345",
        passwordConfirm: "random@12345",
      };
      await adminClient.collection("users").create(data);
    }
    const res = await adminClient.collection("users").requestOTP(email);

    const response = NextResponse.json({
      otpId: res.otpId,
      email,
    });

    return response;
  } catch (e) {
    console.log({ e });
    return errorBadRequest();
  }
};

export const POST = withLoginValidator(loginHandler);
