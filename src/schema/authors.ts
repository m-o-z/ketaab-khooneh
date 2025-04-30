import { z } from "zod";

export const authorsListingSchema = z.object({
  filter: z.string().default(""),
  page: z.number({ coerce: true }).default(0),
  perPage: z.number({ coerce: true }).default(10),
});
export type AuthorListingRequestPayload = z.infer<typeof authorsListingSchema>;
