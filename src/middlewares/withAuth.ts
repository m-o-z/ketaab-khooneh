import "server-only";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type PocketBase from "pocketbase";

import { ApiHandler } from "@/@types/api";
import { Context } from "@/@types/pocketbase";
import { UserCoreSchema, UserDBSchema } from "@/schema/users";
import { PocketBaseService } from "@/services/PocketBaseService";
import setAccessToken from "@/utils/setAcessToken";
import appConfig from "../../app.config";

const DAYS_TO_REFRESH = parseInt(appConfig.auth.daysToRefresh ?? "7", 10);

const decodeToken = (tokenString: string) => {
  try {
    const decodedToken = jwtDecode(tokenString);
    return decodedToken;
  } catch {
    return null;
  }
};

const getExpiringInDays = (jwtPayload: JwtPayload | null) => {
  if (!jwtPayload) {
    return -1;
  }
  if ("exp" in jwtPayload) {
    const expirationTs = jwtPayload.exp!;
    const currentTimeTs = Math.floor(Date.now() / 1000);

    const timeDifferenceInSeconds = expirationTs - currentTimeTs;
    if (timeDifferenceInSeconds <= 0) {
      return -1;
    }

    const secondsInADay = 24 * 60 * 60;

    const timeDifferenceInDay = timeDifferenceInSeconds / secondsInADay;
    const wholeDaysLeft = Math.floor(timeDifferenceInDay);
    return wholeDaysLeft;
  }
  return -1;
};

type HandleAuthRefreshPayload = {
  tokenString: string;
  client: PocketBase;
  response: NextResponse;
  request: NextRequest;
};
const handleAuthRefresh = async ({
  response,
  request,
  client,
  tokenString,
}: HandleAuthRefreshPayload) => {
  const jwtPayload = decodeToken(tokenString);
  const wholeDaysLeft = getExpiringInDays(jwtPayload);

  if (wholeDaysLeft < DAYS_TO_REFRESH) {
    const { token } = await client.collection("users").authRefresh();
    const origin = new URL(request.url).hostname;
    return setAccessToken({
      origin,
      token,
      response,
    });
  }
};

const clearCookie = async (request: NextRequest, response: NextResponse) => {
  const requestURL = request.headers.get("origin") || request.url;
  const origin = new URL(requestURL).hostname;
  return setAccessToken({
    origin,
    maxAge: -1,
    token: "",
    response,
  });
};

const responseUnauthorized = async (request: NextRequest) => {
  const response = NextResponse.json(
    {
      status: "ERROR",
      message: "you are not authorized",
    },
    { status: 401 },
  );
  await clearCookie(request, response);
  return response;
};

export const withAuth = (handler: ApiHandler) => {
  return async function (req: NextRequest, context: Context) {
    const pb = PocketBaseService.Client();
    try {
      const accessToken = (await cookies()).get("accessToken");
      if (!accessToken) {
        return responseUnauthorized(req);
      }

      pb.authStore.save(accessToken.value);
      await pb.collection("users").authRefresh();
      const record = pb.authStore.record;

      try {
        context["user_db"] = UserDBSchema.parse(record);
        context["user"] = UserCoreSchema.parse(record);
      } catch (e) {
        return responseUnauthorized(req);
      }

      if (!pb.authStore.isValid) {
        return responseUnauthorized(req);
      }

      context.pb = pb;
      context.admin = await PocketBaseService.AdminClient();
      const response = await handler(req, context);
      if (response instanceof NextResponse) {
        await handleAuthRefresh({
          client: pb,
          request: req,
          response,
          tokenString: accessToken.value,
        });
      }
      return response;
    } catch (e) {
      console.log({ e });
      return responseUnauthorized(req);
    }
  };
};
