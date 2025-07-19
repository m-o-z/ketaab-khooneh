import { NextRequest } from "next/server";
import {
  isAlreadySubscribedSchema,
  isSubscribedResponseSchema,
} from "./route.schema";

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

    const result = await SubscriptionService.findSubscription({
      recordId: bookId,
      targetCollection: "books",
      type: "GOT_AVAILABLE",
      user: user.id,
    });

    return Response.json(
      createResponsePayload(
        isSubscribedResponseSchema.parse({
          isSubscribed: result != null,
        }),
      ),
      {
        status: 200,
      },
    );
  } catch (err) {
    return handleErrors(err);
  }
};

export const GET = withAuth(handler);
