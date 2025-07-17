import { NextRequest } from "next/server";
import { pushSubscriptionPayloadSchema } from "./route.schema";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import PushSubscriptionService from "@/services/PushSubscriptionService";
import { errorBadRequest } from "@/utils/errors/errors";
import { handleErrors } from "@/utils/handleErrors";
import { createResponsePayload } from "@/utils/response";

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  const client = context.pb;
  if (!client || !client.authStore.record?.id) {
    return errorBadRequest();
  }

  try {
    const user = context.user;
    const rawBody = await req.json();
    const body = pushSubscriptionPayloadSchema.parse(rawBody);

    await PushSubscriptionService.createPushSubscription(body, user.id);

    return Response.json(createResponsePayload(null), {
      status: 200,
    });
  } catch (err) {
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
