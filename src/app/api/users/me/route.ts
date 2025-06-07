import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { UserInfo } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest, context: Context) => {
  try {
    const user = context.user as UserInfo;
    return Response.json(createResponsePayload(user), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
