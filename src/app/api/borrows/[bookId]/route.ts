import { Context } from "@/@types/pocketbase";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { Book, Borrow, UserInfo } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { toStandardGeorgianDateTime } from "@/utils/prettifyDate";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";
import {
  borrowingNotAllowed,
  errorUserIsPunished,
  wrongDueDate,
} from "./errors";

type ResponseError = {
  message: string;
};

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
    const result = await ruleEngine.execute("BEFORE_BORROW", initialContext);

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

    // (Ideally in a transaction)
    await clientAdmin
      .collection("books")
      .update(book.id, { "availableCount-": 1 });
    const borrowRecord = await clientAdmin.collection("borrows").create({
      user: user.id,
      book: book.id,
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: "ACTIVE",
    });

    return Response.json(
      createResponsePayload(borrowRecord, "Book borrowed successfully!"),
    );
  } catch (err) {
    console.log({ err });
    return errorBadRequest();
  }
};

export const POST = withAuth(handler);
