import { Context } from "@/@types/pocketbase";
import { pbAdminClient } from "@/client/pbClient";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { errorBadRequest } from "@/utils/errors/errors";
import { createResponsePayload } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import { borrowingNotAllowed, wrongDueDate } from "./errors";

type ResponseError = {
  message: string;
};

const handler = async (req: NextRequest, context: Context) => {
  const pbAdmin = await pbAdminClient();
  const params = await context.params;
  const pb = context.pb;
  if (!pb || !pb.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const user = await pb.collection("users").getOne(pb.authStore.record.id);
    const book = await pb.collection("books").getOne(params.bookId);

    const initialContext = { user, book, borrows: {} };

    const ruleEngine = new RuleEngineService(pbAdmin);
    const result = await ruleEngine.execute("BEFORE_BORROW", initialContext);

    if (!result.allowed) {
      return borrowingNotAllowed();
    }

    const { dueDate } = result.modifiedContext.borrows;

    if (!dueDate) {
      return wrongDueDate();
    }

    // (Ideally in a transaction)
    await pbAdmin.collection("books").update(book.id, { "availableCount-": 1 });
    const borrowRecord = await pbAdmin.collection("borrows").create({
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
