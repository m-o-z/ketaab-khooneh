import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { BorrowBriefDTOSchema } from "@/schema/borrows";
import BorrowService from "@/services/BorrowService";
import { errorBadRequest } from "@/utils/errors/errors";
import { handleErrors } from "@/utils/handleErrors";
import { createPagedResponsePayload } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import Client from "pocketbase";

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  const page = 0;
  const perPage = 10;

  const pb = context.pb as Client;
  if (!pb || !pb.authStore.record?.id) {
    return errorBadRequest();
  }
  const userId = context.user.id;

  try {
    const { borrowsCore, meta } = await BorrowService.getUserActiveBorrows(
      userId,
      {
        page,
        perPage,
      },
    );
    const userBorrowsDTO = BorrowBriefDTOSchema.array().parse(borrowsCore);

    return NextResponse.json(createPagedResponsePayload(userBorrowsDTO, meta), {
      status: 200,
    });
  } catch (err) {
    return handleErrors(err);
  }
};

export const GET = withAuth(handler);
