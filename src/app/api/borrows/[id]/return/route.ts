import { NextRequest } from "next/server";

import { Context } from "@/@types/pocketbase";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { errorBadRequest } from "@/utils/errors/errors";
import { toStandardGeorgianDateTime } from "@/utils/prettifyDate";
import { createResponsePayload } from "@/utils/response";

import { BookDB } from "@/schema/books";
import { BorrowDB } from "@/schema/borrows";
import { UserDB } from "@/schema/users";
import { handleErrors } from "@/utils/handleErrors";
import { borrowingNotAllowed, errorUserIsPunished } from "../borrow/errors";

const handler = async (req: NextRequest, context: Context) => {
  const params = await context.params;
  const clientAdmin = context.admin;
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const borrow = await client
      .collection<BorrowDB>("borrows")
      .getOne(params.id);

    const user = await client.collection<UserDB>("users").getOne(borrow.user);
    const book = await client.collection<BookDB>("books").getOne(borrow.book);

    const userBorrows = await client
      .collection<BorrowDB>("borrows")
      .getFullList({
        filter: `user = "${user.id}" && status = "ACTIVE"`,
      });

    const initialContext = {
      user,
      book,
      borrow,
      borrows: {
        count: userBorrows.length,
      },
    };

    const ruleEngine = new RuleEngineService(clientAdmin);
    const result = await ruleEngine.execute("ON_RETURN_LATE", initialContext);
    console.log({ result });

    if (!result.allowed) {
      if (user.isPunished) {
        return errorUserIsPunished(
          toStandardGeorgianDateTime(user.punishmentEndAt!),
        );
      }
      return borrowingNotAllowed(result.message);
    }

    const { user: resultantUser } = result.modifiedContext;

    let shouldPunished = false;
    let punishmentEndAt = null;
    if (resultantUser.isPunished) {
      shouldPunished = true;
      punishmentEndAt = resultantUser.punishmentEndAt;
    }

    const response = await clientAdmin.send("/api/borrows", {
      method: "DELETE",
      body: JSON.stringify({
        borrowId: borrow.id,
        shouldPunished,
        punishmentEndAt,
      }),
    });

    return Response.json(
      createResponsePayload(response.data, "Book returned successfully!"),
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const DELETE = withAuth(handler);
