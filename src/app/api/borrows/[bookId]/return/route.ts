import { NextRequest } from "next/server";

import { Context } from "@/@types/pocketbase";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { Book, Borrow, UserInfo } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { toStandardGeorgianDateTime } from "@/utils/prettifyDate";
import { createResponsePayload } from "@/utils/response";

import { handleErrors } from "@/utils/handleErrors";
import dayjs from "dayjs";
import {
  borrowingNotAllowed,
  errorUserIsPunished,
  wrongDueDate,
} from "../borrow/errors";

const handler = async (req: NextRequest, context: Context) => {
  const params = await context.params;
  const clientAdmin = context.admin;
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const user = await client
      .collection<UserInfo>("users")
      .getOne(client.authStore.record.id);
    const book = await client.collection<Book>("books").getOne(params.bookId);

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
    const result = await ruleEngine.execute("ON_RETURN_LATE", initialContext);

    if (!result.allowed) {
      if (user.isPunished) {
        return errorUserIsPunished(
          toStandardGeorgianDateTime(user.punishmentEndAt),
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

    return Response.json(
      createResponsePayload(response.data, "Book borrowed successfully!"),
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
