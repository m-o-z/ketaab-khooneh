import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { booksListingSchema } from "@/schema/books";
import { Book } from "@/types";
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

    return Response.json(
      {
        books: result,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log({ err });
    return Response.json(
      {
        err,
        message: "Proper data is not provided",
      },
      {
        status: 403,
      },
    );
  }
};

export const GET = withAuth(handler);
