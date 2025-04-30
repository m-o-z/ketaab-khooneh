import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { authorsListingSchema } from "@/schema/authors";
import { Author } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } = authorsListingSchema.parse(searchParams);

    const result = await pbClient
      .collection("authors")
      .getList<Author>(page, perPage, {
        filter,
        page,
        perPage,
        expand: "books,categories",
      });

    return Response.json(createResponsePayload(result.items), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};
export const GET = withAuth(handler);
