import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { booksListingSchema } from "@/schema/books";
import { Book } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } = booksListingSchema.parse(searchParams);

    const result = await pbClient
      .collection("books")
      .getList<Book>(page, perPage, {
        filter,
        expand: "authors,categories",
      });

    return Response.json(createResponsePayload(result), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
