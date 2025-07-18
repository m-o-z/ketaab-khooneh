import { NextRequest } from "next/server";
import { SubscriptionDTOSchema } from "./../../../../../../schema/subscription";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import SubscriptionService from "@/services/SubscriptionService";
import { errorBadRequest } from "@/utils/errors/errors";
import { handleErrors } from "@/utils/handleErrors";
import { createResponsePayload } from "@/utils/response";
import z from "zod";

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const user = context.user;
    const { id: bookId } = await context.params;
    z.string().parse(bookId);

    const result = await SubscriptionService.createSubscription({
      recordId: bookId,
      targetCollection: "subscriptions",
      type: "GOT_AVAILABLE",
      user: user.id,
    });
    return Response.json(
      createResponsePayload(SubscriptionDTOSchema.parse(result)),
      {
        status: 200,
      },
    );
  } catch (err) {
    debugger;
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
