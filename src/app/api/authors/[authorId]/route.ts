import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { Author } from "@/types";
import { errorBadRequest, errorInvalidParams } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  try {
    const { authorId } = await context.params;
    if (!authorId && typeof authorId != "string") {
      return errorInvalidParams();
    }
    const result = await context.pb
      .collection("authors")
      .getOne<Author>(authorId, {
        expand: "books,categories",
      });

    return NextResponse.json(createResponsePayload(result), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};
export const GET = withAuth(handler);
