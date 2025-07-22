import { NextRequest, NextResponse } from "next/server";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { handleErrors } from "@/utils/handleErrors";
import { createResponsePayload } from "@/utils/response";
import { profileCompleteSchema } from "./route.schema";
import { UserDB } from "@/schema/users";
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  // Get the raw request
  try {
    const formData = await req.formData();
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      avatar: formData.get("avatar"),
    };

    profileCompleteSchema.parse(rawData);
    formData.set("verified", true);
    formData.set("isProfileCompleted", true);

    const modifiedUser = await context.admin
      .collection<UserDB>("users")
      .update(context.user.id, formData);

    return NextResponse.json(
      createResponsePayload({
        modifiedUser,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const POST = withAuth(handler);
