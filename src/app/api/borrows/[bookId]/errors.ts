import { createErrorPayload } from "@/utils/errors/errors";
import { NextResponse } from "next/server";

export const wrongDueDate = (message?: string) => {
  const _msg = message ?? "Something wrong happened. wrong due date is set.";
  return NextResponse.json(createErrorPayload(_msg), {
    status: 400,
  });
};

export const borrowingNotAllowed = (message?: string) => {
  const _msg = message ?? "You can not borrow this book";
  return NextResponse.json(createErrorPayload(_msg), {
    status: 400,
  });
};

export const errorUserIsPunished = (punishEndDate: string) => {
  const endDateString = punishEndDate;
  const _msg = `Because of late returning you've punished. until ${endDateString} you can not borrow new book`;
  return NextResponse.json(createErrorPayload(_msg), {
    status: 400,
  });
};
