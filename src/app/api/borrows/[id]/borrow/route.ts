import { NextRequest } from "next/server";

import { Context } from "@/@types/pocketbase";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { Borrow } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { toStandardGeorgianDateTime } from "@/utils/prettifyDate";
import { createResponsePayload } from "@/utils/response";

import { BookDB } from "@/schema/books";
import { BorrowCoreSchema, BorrowDTOSchema } from "@/schema/borrows";
import { UserDB } from "@/schema/users";
import { handleErrors } from "@/utils/handleErrors";
import dayjs from "dayjs";
import {
  borrowingNotAllowed,
  errorUserIsPunished,
  wrongDueDate,
} from "./errors";

const handler = async (req: NextRequest, context: Context) => {
  const params = await context.params;
  const clientAdmin = context.admin;
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const user = await client
      .collection<UserDB>("users")
      .getOne(client.authStore.record.id);
    const book = await client.collection<BookDB>("books").getOne(params.id);

    const userBorrows = await client.collection<Borrow>("borrows").getFullList({
      filter: `user = "${user.id}" && status = "ACTIVE"`,
    });

    const initialContext = {
      user,
      book,
      borrows: {
        count: userBorrows.length,
      },
    };

    const ruleEngine = new RuleEngineService(clientAdmin);
    const result = await ruleEngine.execute("BEFORE_BORROW", initialContext);

    if (!result.allowed) {
      if (user.isPunished) {
        return errorUserIsPunished(
          toStandardGeorgianDateTime(user.punishmentEndAt!),
        );
      }
      return borrowingNotAllowed(result.message);
    }

    const { dueDate } = result.modifiedContext.borrows;

    if (!dueDate) {
      return wrongDueDate();
    }

    const response = await clientAdmin.send("/api/borrows", {
      method: "POST",
      body: JSON.stringify({
        bookId: book.id,
        userId: user.id,
        duration: dayjs(dueDate).diff(dayjs(), "days"),
      }),
    });

    const borrowCore = BorrowCoreSchema.parse(response.data);
    const borrowDto = BorrowDTOSchema.parse(borrowCore);

    return Response.json(
      createResponsePayload(borrowDto, "Book borrowed successfully!"),
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
