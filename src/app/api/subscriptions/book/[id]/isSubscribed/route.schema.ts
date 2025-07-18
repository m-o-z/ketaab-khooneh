import z from "zod";
/* -------------------------------------------------------------------------- */
/*                         isSubscribedResponseSchema                         */
/* -------------------------------------------------------------------------- */
export const isSubscribedResponseSchema = z.object({
  isSubscribed: z.boolean().default(false),
});
export type IsSubscribedResponsePayload = z.infer<
  typeof isSubscribedResponseSchema
>;
