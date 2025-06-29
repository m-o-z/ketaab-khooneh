import {
  BorrowDetailsDtoSchema,
  BorrowDetailsListDtoSchema,
} from "@/lib/dto/borrow";
import { withAuth } from "@/middlewares/withAuth";
import { Borrow } from "@/types";
import { errorBadRequest } from "@/utils/errors/errors";
import log from "@/utils/log";
import { createResponsePayload } from "@/utils/response";
import { NextRequest } from "next/server";
import Client from "pocketbase";

const handler = async (req: NextRequest, context: Context) => {
  const page = 0;
  const perPage = 10;

  const pb = context.pb as Client;
  if (!pb || !pb.authStore.record?.id) {
    return errorBadRequest();
  }
  const userId = pb.authStore.record?.id;

  try {
    const allRecords = await pb
      .collection<Borrow>("borrows")
      .getList(page, perPage, {
        filter: `user = "${userId}"`,
        expand: "user,book",
      });

    const result = BorrowDetailsListDtoSchema.safeParse(allRecords.items);

    if (result.success) {
      return Response.json(createResponsePayload(result.data));
    }
    return errorBadRequest();
  } catch (err) {
    console.log({ err });
    return errorBadRequest();
  }
};

export const GET = withAuth(handler);
