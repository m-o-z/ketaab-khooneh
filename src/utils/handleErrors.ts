import { errorBadRequest } from "./errors/errors";
import { isPocketBaseError, createPocketBaseError } from "./pocketbase";
import { isZodError, createZodError } from "./zod";

export const handleErrors = (error: any) => {
  if (isZodError(error)) {
    return createZodError(error);
  }
  if (isPocketBaseError(error)) {
    return createPocketBaseError(error);
  }
  let message = "message" in error ? (error.message as string) : undefined;
  return errorBadRequest(message);
};
