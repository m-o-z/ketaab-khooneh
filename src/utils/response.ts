export const createResponsePayload = <T>(data: T) => {
  return {
    status: "OK",
    data,
  };
};
