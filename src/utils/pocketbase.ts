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

export const createPocketBaseError = (message?: string) => {
  const _message = message ?? "Something unexpected happened.";

  const response: ApiErrorResponse = {
    status: "ERR",
    type: "internal",
    message: _message,
  };
  return Response.json(response, { status: 400 });
};
