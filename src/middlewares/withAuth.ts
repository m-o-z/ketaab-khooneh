import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export const withAuth = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: any) {
    const pb = pbClient();
    try {
      const accessToken = (await cookies()).get("accessToken");
      if (!accessToken) {
        return NextResponse.json(
          {
            status: "ERROR",
            message: "you are not authorized",
          },
          { status: 401 },
        );
      }

      pb.authStore.save(accessToken.value);
      await pb.collection("users").authRefresh();
      context["user"] = pb.authStore.model;

      if (!pb.authStore.isValid) {
        return NextResponse.json(
          {
            status: "ERROR",
            message: "you are not authorized",
          },
          { status: 401 },
        );
      }

      context.pb = pb;
      return handler(req, context);
    } catch (e) {
      console.log({ e });
      return NextResponse.json(
        {
          status: "ERROR",
          message: "you are not authorized",
        },
        { status: 401 },
      );
    }
  };
};
