import { NextResponse } from "next/server";

type Payload = {
  response: NextResponse;
  token: string;
  origin: string;
  maxAge?: number;
  httpOnly?: boolean;
};
export default function setAccessToken({
  response,
  token,
  origin,
  maxAge = 60 * 60 * 24 * 14,
  httpOnly = true,
}: Payload) {
  void response.cookies.set("accessToken", token, {
    httpOnly: httpOnly,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    domain: origin,
    path: "/",
  });
}
