import { errorBadRequest } from "./errors/errors";
import { isPocketBaseError, createPocketBaseError } from "./pocketbase";
import { isZodError, createZodError } from "./zod";

export const handleErrors = (error: any) => {
  if (isZodError(error)) {
    return createZodError(error);
  } else if (isPocketBaseError(error)) {
    return createPocketBaseError();
  }
  return errorBadRequest();
};
