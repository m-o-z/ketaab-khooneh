import { ApiHandler } from "@/@types/api";
import pbClient from "@/client/pbClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cookieParse } from "pocketbase";
export const withAuth = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: any) {
    const _cookies = await cookies();
    const result = cookieParse(_cookies.toString() ?? "");
    if (!result["accessToken"]) {
      return NextResponse.json(
        {
          status: "ERROR",
          message: "you are not authorized",
        },
        { status: 401 },
      );
    }
    pbClient.authStore.save(result["accessToken"]);
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
  };
};
