import { NextRequest, NextResponse } from "next/server";
import { ClientResponseError } from "pocketbase";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { BookCoreSchema, BookDB, BookDTOSchema } from "@/schema/books";
import { BorrowDBSchema } from "@/schema/borrows";
import BorrowService from "@/services/BorrowService";
import { errorInvalidParams, errorRecordNotFound } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";

const handler = async (
  req: NextRequest,
  context: AuthorizedContext,
  params: any,
) => {
  const { id: idParam } = await context.params;
  if (!idParam && typeof idParam != "string") {
    return errorInvalidParams();
  }

  try {
    const book = await context.pb.collection<BookDB>("books").getOne(idParam, {
      expand: "bookWork.authors,bookWork.categories",
    });

    const borrows = await BorrowService.getUserActiveBorrowsForBook(
      context.user.id,
      book.id,
      {
        page: 1,
        perPage: 999,
      },
    );

    const bookWithUserBorrows: BookDB = {
      ...book,
      userBorrows: BorrowDBSchema.array().parse(borrows.items),
    };

    const bookCore = BookCoreSchema.parse(bookWithUserBorrows);
    const bookDTO = BookDTOSchema.parse(bookCore);
    return NextResponse.json(createResponsePayload(bookDTO), { status: 200 });
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && e.status === 404) {
      return errorRecordNotFound("Book with `" + idParam + "` id is not found");
    }
    throw e;
  }
};
export const GET = withAuth(handler);
