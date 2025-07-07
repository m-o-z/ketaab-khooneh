import { NextResponse } from "next/server";

import { ApiErrorResponse } from "../response";

export const createErrorPayload = (
  type: ApiErrorResponse["type"],
  message: string,
): ApiErrorResponse => {
  let _message: string = message;
  if (typeof message != "string") {
    _message = String(message);
  }

  if (!_message || _message == "") {
    _message = "something went wrong!";
  }

  return {
    status: "ERR",
    type,
    message: _message,
  } as ApiErrorResponse;
};
export const errorInvalidParams = (message?: string) => {
  const _msg = message ?? "Params is provided is not valid.";
  return NextResponse.json(createErrorPayload("validation", _msg), {
    status: 422,
  });
};

export const errorBadRequest = (message?: string) => {
  const _msg = message ?? "Invalid data provided. please provide proper data.";
  return NextResponse.json(createErrorPayload("internal", _msg), {
    status: 403,
  });
};

export const errorRecordNotFound = (message?: string) => {
  const _msg = message ?? "Record you was looking for is not found.";
  return NextResponse.json(createErrorPayload("logical", _msg), {
    status: 404,
  });
};
