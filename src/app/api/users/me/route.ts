import { AuthorizedContext } from "@/@types/pocketbase";
import { withAuth } from "@/middlewares/withAuth";
import { UserDTOSchema } from "@/schema/users";
import UserService from "@/services/UserService";
import { errorBadRequest } from "@/utils/errors/errors";
import { handleErrors } from "@/utils/handleErrors";
import { createPocketBaseError, isPocketBaseError } from "@/utils/pocketbase";
import { createResponsePayload } from "@/utils/response";
import { createZodError, isZodError } from "@/utils/zod";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, context: AuthorizedContext) => {
  try {
    const userCore = await UserService.getUser(context.user.id);
    return NextResponse.json(
      createResponsePayload(UserDTOSchema.parse(userCore)),
      {
        status: 200,
      },
    );
  } catch (err) {
    return handleErrors(err);
  }
};

export const GET = withAuth(handler);
