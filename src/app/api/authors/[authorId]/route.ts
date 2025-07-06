import { NextRequest, NextResponse } from "next/server";

import { Context } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import {
  AuthorCoreSchema,
  AuthorDB,
  AuthorDBSchema,
  AuthorDTOSchema,
} from "@/schema/authors";
import { Author } from "@/types";
import { errorBadRequest, errorInvalidParams } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";

const handler = async (req: NextRequest, context: Context) => {
  try {
    const { authorId } = await context.params;
    if (!authorId && typeof authorId != "string") {
      return errorInvalidParams();
    }
    const result = await context.pb
      .collection("authors")
      .getOne<AuthorDB>(authorId, {
        expand: "books,categories",
      });

    const authorCore = AuthorCoreSchema.parse(result);
    const authorDTO = AuthorDTOSchema.parse(authorCore);

    return NextResponse.json(createResponsePayload(authorDTO), {
      status: 200,
    });
  } catch (err) {
    return errorBadRequest();
  }
};
export const GET = withAuth(handler);
