export const createResponsePayload = <T>(data: T, message?: string) => {
  let result: Record<string, any> = {
    status: "OK",
    data,
  };

  if (message) {
    result["message"] = message;
  }
  return result;
};
