import { NextRequest, NextResponse } from "next/server";

import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { UserDB } from "@/schema/users";
import { handleErrors } from "@/utils/handleErrors";
import { createResponsePayload } from "@/utils/response";
import { ProfileEditRequestPayload, profileEditSchema } from "./route.schema";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  try {
    const formData = await req.formData();
    const rawData = {
      firstName: formData.get("firstName") ?? undefined,
      lastName: formData.get("lastName") ?? undefined,
      avatar: formData.get("avatar") ?? undefined,
    };
    const validatedPayload = profileEditSchema.parse(rawData);

    const modifiedUser = await context.admin
      .collection<UserDB>("users")
      .update(context.user.id, validatedPayload);

    return NextResponse.json(
      createResponsePayload(
        {
          modifiedUser,
        },
        "user edited successfully",
      ),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log({ err });
    return handleErrors(err);
  }
};

export const PATCH = withAuth(handler);
