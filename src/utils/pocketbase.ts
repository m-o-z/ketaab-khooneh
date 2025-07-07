import { ClientResponseError } from "pocketbase";

import { ApiErrorResponse } from "./response";

export function isPocketBaseError(
  error: any,
): error is { response: any; status: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "status" in error
  );
}

const isClientResponseError = (err: any): err is ClientResponseError => {
  return err instanceof ClientResponseError;
};

export const createPocketBaseError = (err: any, message?: string) => {
  const _message = message ?? "Something unexpected happened.";

  if (isClientResponseError(err) && err.status === 404) {
    const response: ApiErrorResponse = {
      status: "ERR",
      type: "internal",
      message: "Record did not found",
    };
    return Response.json(response, { status: 404 });
  }

  const response: ApiErrorResponse = {
    status: "ERR",
    type: "internal",
    message: _message,
  };
  return Response.json(response, { status: 400 });
};
