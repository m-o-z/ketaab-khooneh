import { NextRequest, NextResponse } from "next/server";

import { ApiHandler } from "@/@types/api";

import { VerifyOTPRequestSchema } from "./verify.schema";

const extractBodyJson = async (req: NextRequest) => {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      throw new Error("Body is not json format");
    }
    const body = await req.json();

    return body;
  } catch (e) {
    console.log({ e });
    throw new Error("JSON body is malformed.");
  }
};

const validateBody = (body: any) => {
  const result = VerifyOTPRequestSchema.safeParse(body);
  if (result.success) {
    return result.data;
  }
  throw new Error(
    result.error.errors.map((issues) => issues.message).join(", "),
  );
};
export const withVerifyValidator = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: any) {
    try {
      const body = await extractBodyJson(req.clone() as NextRequest);
      validateBody(body);
      context.body = body;
      return await handler(req, context);
    } catch (e) {
      console.log("ERROR::", { error: e });
      return NextResponse.json(
        {
          status: "Error",
          message: String(e),
        },
        { status: 400 },
      );
    }
  };
};
