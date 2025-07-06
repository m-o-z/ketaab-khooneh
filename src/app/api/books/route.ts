import { NextRequest } from "next/server";

import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { BookBriefDTOSchema, BookDB, parseBooksQuery } from "@/schema/books";
import { errorBadRequest } from "@/utils/errors/errors";
import { createPagedResponsePayload } from "@/utils/response";

import { BookListingRequestSchema } from "../authors/route.schema";

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } =
      BookListingRequestSchema.parse(searchParams);

    const response = await context.pb
      .collection("books")
      .getList<BookDB>(page, perPage, {
        filter,
        expand: "bookWork.authors,bookWork.categories",
      });

    const books = parseBooksQuery(response.items);
    const booksDTO = BookBriefDTOSchema.array().parse(books);

    return Response.json(createPagedResponsePayload(booksDTO, response), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
