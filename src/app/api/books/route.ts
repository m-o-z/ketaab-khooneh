import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { Book } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import {
  createPagedResponsePayload,
  createResponsePayload,
} from "@/utils/response";
import { NextRequest } from "next/server";
import { BookListingRequestSchema } from "../authors/route.schema";
import {
  BookBriefDTOSchema,
  BookDB,
  BookDBSchema,
  parseBooksQuery,
} from "@/schema/books";
import { extractPagedMeta } from "@/utils/pagination";
import log from "@/utils/log";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } =
      BookListingRequestSchema.parse(searchParams);

    let response = await context.pb
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
    debugger;
    console.log({ err });
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
