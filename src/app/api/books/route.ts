import pbClient from "@/client/pbClient";
import utils from "util";
import { withAuth } from "@/middlewares/withAuth";
import { booksListingSchema } from "@/schema/books";
import { Book } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";
import { Context } from "@/@types/pocketbase";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } = booksListingSchema.parse(searchParams);

    console.log({ filter, page, perPage, context });
    let { items } = await context.pb
      .collection("books")
      .getList<Book>(page, perPage, {
        filter,
        expand: "authors,categories",
      });

    return Response.json(createResponsePayload(items), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
