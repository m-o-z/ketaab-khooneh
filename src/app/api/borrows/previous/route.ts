import { NextRequest, NextResponse } from "next/server";
import Client from "pocketbase";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { BorrowBriefDTOSchema } from "@/schema/borrows";
import BorrowService from "@/services/BorrowService";
import { errorBadRequest } from "@/utils/errors/errors";
import { handleErrors } from "@/utils/handleErrors";
import { createPagedResponsePayload } from "@/utils/response";

import { ActiveBorrowsListingRequestSchema } from "../../authors/route.schema";

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { filter, page, perPage } =
    ActiveBorrowsListingRequestSchema.parse(searchParams);

  const pb = context.pb;
  if (!pb || !pb.authStore.record?.id) {
    return errorBadRequest();
  }
  const userId = context.user.id;

  try {
    const { borrowsCore, meta } = await BorrowService.getUserPreviousBorrows(
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
