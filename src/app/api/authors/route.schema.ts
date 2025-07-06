import { z } from "zod";

const BasePaginationSchema = z.object({
  page: z.number({ coerce: true }).default(0),
  perPage: z.number({ coerce: true }).default(10),
});

const BaseFilterSchema = z.object({
  filter: z.string().default(""),
});

// Authors
export const AuthorsListingRequestSchema = z
  .object({})
  .merge(BasePaginationSchema)
  .merge(BaseFilterSchema);

export type AuthorsListingRequestPayload = z.infer<
  typeof AuthorsListingRequestSchema
>;

// Books
export const BookListingRequestSchema = z
  .object({})
  .merge(BasePaginationSchema)
  .merge(BaseFilterSchema);

export type BookListingRequestPayload = z.infer<
  typeof BookListingRequestSchema
>;

export const ActiveBorrowsListingRequestSchema = z
  .object({})
  .merge(BasePaginationSchema)
  .merge(BaseFilterSchema);

export type ActiveBorrowsListingRequestPayload = z.infer<
  typeof ActiveBorrowsListingRequestSchema
>;
