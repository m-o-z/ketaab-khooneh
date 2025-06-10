import { ApiHandler } from "@/@types/api";
import { jwtDecode, JwtPayload } from "jwt-decode";
import pbClient from "@/client/pbClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Client from "pocketbase";
import setAccessToken from "@/utils/setAcessToken";
const DAYS_TO_REFRESH = parseInt(
  process.env.NEXT_PUBLIC_DAYS_TO_REFRESH ?? "7",
  10,
);
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
  client: Client;
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
    console.log({ token, origin });
    await setAccessToken({
      origin,
      token,
      response,
    });
  }
};

const clearCookie = async (request: NextRequest, response: NextResponse) => {
  const origin = new URL(request.url).hostname;
  await setAccessToken({
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
  return async function (req: NextRequest, context: any) {
    const pb = pbClient();
    try {
      const accessToken = (await cookies()).get("accessToken");
      if (!accessToken) {
        return responseUnauthorized(req);
      }

      pb.authStore.save(accessToken.value);
      await pb.collection("users").authRefresh();
      context["user"] = pb.authStore.record;

      if (!pb.authStore.isValid) {
        return responseUnauthorized(req);
      }

      context.pb = pb;
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
