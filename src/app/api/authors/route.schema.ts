import { z } from "zod";

// Authors
export const AuthorsListingRequestSchema = z.object({
  filter: z.string().default(""),
  page: z.number({ coerce: true }).default(0),
  perPage: z.number({ coerce: true }).default(10),
});
export type AuthorsListingRequestPayload = z.infer<
  typeof AuthorsListingRequestSchema
>;

// Books
export const BookListingRequestSchema = z.object({
  filter: z.string().default(""),
  page: z.number({ coerce: true }).default(0),
  perPage: z.number({ coerce: true }).default(10),
});

export type BookListingRequestPayload = z.infer<
  typeof BookListingRequestSchema
>;
