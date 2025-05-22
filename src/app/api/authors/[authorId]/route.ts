import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { authorsListingSchema } from "@/schema/authors";
import { Author } from "@/types";
import { errorBadRequest, errorInvalidParams } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: any) => {
  try {
    const { authorId } = await context.params;
    if (!authorId && typeof authorId != "string") {
      return errorInvalidParams();
    }
    const result = await pbClient
      .collection("authors")
      .getOne<Author>(authorId, {
        expand: "books,categories",
      });

    return Response.json(createResponsePayload(result), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};
export const GET = withAuth(handler);
