import { NextRequest } from "next/server";

import { Context } from "@/@types/pocketbase";
import { RuleEngineService } from "@/lib/ruleEngine";
import { withAuth } from "@/middlewares/withAuth";
import { Borrow } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import { toStandardGeorgianDateTime } from "@/utils/prettifyDate";
import { createResponsePayload } from "@/utils/response";

import { BorrowCoreSchema, BorrowDB, BorrowDTOSchema } from "@/schema/borrows";
import { UserDB } from "@/schema/users";
import { handleErrors } from "@/utils/handleErrors";
import { borrowingNotAllowed, errorUserIsPunished } from "./errors";

const handler = async (req: NextRequest, context: Context) => {
  const params = await context.params;
  const clientAdmin = context.admin;
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const borrowId = params.id;
    const user = await client
      .collection<UserDB>("users")
      .getOne(client.authStore.record.id);
    const borrowDb = await client
      .collection<BorrowDB>("borrows")
      .getOne(borrowId, {
        expand: "book",
      });

    const userBorrows = await clientAdmin
      .collection<Borrow>("borrows")
      .getFullList({
        filter: `user = "${user.id}" && status = "ACTIVE"`,
      });

    const initialContext = {
      user,
      book: borrowDb.expand?.book!,
      borrow: borrowDb,
      borrows: {
        count: userBorrows.length,
      },
    };

    const ruleEngine = new RuleEngineService(clientAdmin);
    const result = await ruleEngine.execute("BEFORE_EXTEND", initialContext);

    if (!result.allowed) {
      if (user.isPunished) {
        return errorUserIsPunished(
          toStandardGeorgianDateTime(user.punishmentEndAt!),
        );
      }
      return borrowingNotAllowed(result.message);
    }

    const updatedBorrow = await clientAdmin
      .collection<BorrowDB>("borrows")
      .update(borrowDb.id, {
        extendedCount: (borrowDb.extendedCount ?? 0) + 1,
        status: "EXTENDED",
      });

    const borrowCore = BorrowCoreSchema.parse(updatedBorrow);
    const borrowDto = BorrowDTOSchema.parse(borrowCore);

    return Response.json(
      createResponsePayload(borrowDto, "Your borrow is extended successfully!"),
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
