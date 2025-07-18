import { NextRequest, NextResponse } from "next/server";

import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";

import { RequestOTPRequestSchema } from "./login.schema";

const extractBodyJson = async (req: NextRequest) => {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      throw new Error("Body is not json format");
    }
    const body = (await req.json()) as Record<string, any>;

    return body;
  } catch (e) {
    console.log({ e });
    throw new Error("JSON body is malformed.");
  }
};

const validateBody = (body: any) => {
  const result = RequestOTPRequestSchema.safeParse(body);
  if (result.success) {
    return result.data;
  }
  throw new Error(
    result.error.errors.map((issues) => issues.message).join(", "),
  );
};

export const withLoginValidator = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: Context) {
    try {
      const body = await extractBodyJson(req.clone() as NextRequest);
      validateBody(body);
      context.body = body;
      return await handler(req, context);
    } catch (e) {
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
