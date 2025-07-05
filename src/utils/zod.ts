import { ZodError } from "zod";
import { ApiErrorResponse } from "./response";

export const isZodError = (e: any): e is ZodError => {
  return e instanceof ZodError;
};

export const createZodError = (
  zodError: ZodError,
  message: string = "Something unexpected happened.",
) => {
  const response: ApiErrorResponse = {
    status: "ERR",
    type: "validation",
    errors: zodError.flatten().fieldErrors,
    message,
  };
  return Response.json(response, { status: 400 });
};
