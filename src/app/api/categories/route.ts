import { NextRequest, NextResponse } from "next/server";

import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import {
  categoriesSchema,
  CategoryCoreSchema,
  CategoryDB,
  CategoryDTOSchema,
} from "@/schema/categories";
import { handleErrors } from "@/utils/handleErrors";
import { createResponsePayload } from "@/utils/response";
import { withTimeout } from "@/utils/withTimeout";

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    let { page, perPage, skipTotal } = categoriesSchema.parse(searchParams);
    if (perPage === -1) {
      page = 0;
      perPage = Infinity;
    }

    const query = withTimeout(() => {
      const result = context.pb
        .collection("categories")
        .getFullList<CategoryDB>({
          page,
          perPage,
          skipTotal,
        });
      return result;
    }, 3000);

    const result = await query;

    const categoriesCore = CategoryCoreSchema.array().parse(result);
    const categoriesDto = CategoryDTOSchema.array().parse(categoriesCore);

    return NextResponse.json(createResponsePayload(categoriesDto), {
      status: 200,
    });
  } catch (err) {
    return handleErrors(err);
  }
};

export const GET = withAuth(handler);
