import { Context } from "@/@types/pocketbase";
import redis from "@/lib/redis";
import { withAuth } from "@/middlewares/withAuth";
import { booksListingSchema } from "@/schema/books";
import { Book, BookWork } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } = booksListingSchema.parse(searchParams);

    let { items } = await context.pb
      .collection("books")
      .getList<Book>(page, perPage, {
        filter,
        expand: "bookWork.authors,bookWork.categories",
      });

    return Response.json(createResponsePayload(items), {
      status: 200,
    });
  } catch (err) {
    console.log({ err });
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
