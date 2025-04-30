import { ApiHandler } from "@/@types/api";
import { withAuth } from "@/middlewares/withAuth";
import { createResponsePayload } from "@/utils/response";
import { NextResponse } from "next/server";

// pbClient.collection("users").authWithPassword(email, password)
const loginHandler: ApiHandler = async (req, context) => {
  const response = NextResponse.json(
    createResponsePayload("You have logged out."),
    { status: 201 },
  );

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    domain: req.headers.get("origin") || "localhost",
    path: "/",
  });

  return response;
};

export const POST = loginHandler;
