import pbClient from "@/client/pbClient";
import { authorsListingSchema } from "@/schema/authors";
import { Author } from "@/types";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type ResponseError = {
  message: string;
};

export async function GET(req: NextRequest) {
  pbClient.authStore.save(cookies().get("pb_auth")?.value ?? "", { model: {} });

  if (!pbClient.authStore.isValid) {
    return Response.json(
      {
        message: "You are not allowed to use this fucking app.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { filter, page, perPage } = authorsListingSchema.parse(searchParams);

    const result = await pbClient
      .collection("authos")
      .getList<Author>(page, perPage, {
        filter,
      });

    return Response.json(
      {
        books: result,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log({ err });
    return Response.json(
      {
        err,
        message: "Proper data is not provided",
      },
      {
        status: 403,
      },
    );
  }
}
