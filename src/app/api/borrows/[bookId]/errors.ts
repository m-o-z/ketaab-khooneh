import { createErrorPayload } from "@/utils/errors/errors";
import { NextResponse } from "next/server";

export const wrongDueDate = (message?: string) => {
  const _msg = message ?? "Something wrong happened. wrong due date is set.";
  return NextResponse.json(createErrorPayload(_msg), {
    status: 400,
  });
};

export const borrowingNotAllowed = () => {
  const _msg = "You can not borrow this book";
  return NextResponse.json(createErrorPayload(_msg), {
    status: 400,
  });
};
