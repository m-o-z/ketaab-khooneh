import { NextRequest, NextResponse } from "next/server";

import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import {
  AuthorBriefDTOSchema,
  AuthorCoreSchema,
  AuthorDB,
} from "@/schema/authors";
import { Author } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { createPagedResponsePayload } from "@/utils/response";

import { AuthorsListingRequestSchema } from "./route.schema";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } =
      AuthorsListingRequestSchema.parse(searchParams);

    const result = await context.pb
      .collection<AuthorDB>("authors")
      .getList<Author>(page, perPage, {
        filter,
        page,
        perPage,
        expand: "books,categories",
      });

    const authorsCore = AuthorCoreSchema.array().parse(result.items);
    const authorsDTO = AuthorBriefDTOSchema.array().parse(authorsCore);

    return NextResponse.json(createPagedResponsePayload(authorsDTO, result), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};
export const GET = withAuth(handler);
