import { createErrorPayload } from "@/utils/errors/errors";

export const errorProfileCompletedAlready = () => {
  return Response.json(
    createErrorPayload("logical", "User profile already has completed."),
    {
      status: 403,
    },
  );
};
