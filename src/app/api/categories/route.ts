import pbClient from "@/client/pbClient";
import { withAuth } from "@/middlewares/withAuth";
import { categoriesSchema } from "@/schema/categories";
import { BookCategory } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { withTimeout } from "@/utils/withTimeout";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    let { page, perPage, skipTotal } = categoriesSchema.parse(searchParams);
    if (perPage === -1) {
      page = 0;
      perPage = Infinity;
    }

    const query = withTimeout(() => {
      const result = pbClient
        .collection("categories")
        .getFullList<BookCategory>({
          page,
          perPage,
          skipTotal,
        });
      return result;
    }, 3000);

    const result = await query;

    return Response.json(createResponsePayload(result), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
