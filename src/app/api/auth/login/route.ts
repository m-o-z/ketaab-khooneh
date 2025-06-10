import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";
import { pbAdminClient } from "@/client/pbClient";
import { errorBadRequest } from "@/utils/errors/errors";
import { NextResponse } from "next/server";
import { RequestOTPRequestPayload } from "./login.schema";
import { withLoginValidator } from "./validator";

const pb = await pbAdminClient();
const loginHandler: ApiHandler = async (req, context: Context) => {
  const body = await req.json();
  const { email } = body as RequestOTPRequestPayload;
  let hasFirstItem = false;
  try {
    await pb.collection("users").getFirstListItem(`email="${email}"`);
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
      await pb.collection("users").create(data);
    }
    const res = await pb.collection("users").requestOTP(email);

    const response = NextResponse.json({
      otpId: res.otpId,
    });

    return response;
  } catch (e) {
    console.log({ e });
    return errorBadRequest();
  }
};

export const POST = withLoginValidator(loginHandler);
