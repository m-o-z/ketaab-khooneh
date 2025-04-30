import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { Book } from "@/types";
import { errorInvalidParams, errorRecordNotFound } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import { ClientResponseError } from "pocketbase";

const handler = async (req: NextRequest, context: any, params: any) => {
  const { id: idParam } = await context.params;
  if (!idParam && typeof idParam != "string") {
    return errorInvalidParams();
  }

  try {
    const book = await pbClient.collection("books").getOne<Book>(idParam, {
      expand: "authors,categories",
    });
    return NextResponse.json(createResponsePayload(book), { status: 200 });
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && e.status === 404) {
      return errorRecordNotFound("Book with `" + idParam + "` id is not found");
    }
    throw e;
  }
};
export const GET = withAuth(handler);
