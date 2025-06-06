import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export const withAuth = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: any) {
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

      pbClient.authStore.save(accessToken.value);
      await pbClient.collection("users").authRefresh();
      context["user"] = pbClient.authStore.model;

      if (!pbClient.authStore.isValid) {
        return NextResponse.json(
          {
            status: "ERROR",
            message: "you are not authorized",
          },
          { status: 401 },
        );
      }
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
