import { z } from "zod";

export const BookListingRequestSchema = z.object({
  filter: z.string().default(""),
  page: z.number({ coerce: true }).default(0),
  perPage: z.number({ coerce: true }).default(10),
});

export type BookListingRequestPayload = z.infer<
  typeof BookListingRequestSchema
>;

export const RawBookWorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  categories: z.array(z.string()),
  authors: z.array(z.string()),
  expand: z
    .object({
      authors: z.object({}), // TODO: define authors schema
      categories: z.object({}), // TODO: define authors schema
      books_via_bookWork: z.object({}), // TODO: define authors schema
    })
    .optional(),
});

export const RawBookSchema = z.object({
  id: z.string(),
  bookWork: z.string(),
  collectionId: z.string(),
  edition: z.string().default("N/A"),
  coverImage: z.array(z.string()).default([]), // Handle missing images
  status: z
    .enum([
      "UNAVAILABLE",
      "AVAILABLE",
      "BORROWED",
      "RESERVED_BY_OTHERS",
      "RESERVED_BY_ME",
    ])
    .default("UNAVAILABLE"),
  totalCount: z.number().default(0),
  availableCount: z.number().default(0),
  releaseYear: z.string(),
  language: z.enum(["ENGLISH", "PERSIAN"]).default("ENGLISH"),
  subTitle: z.string(),
  description: z.string(),
  expand: z
    .object({
      bookWork: z.object({}),
    })
    .optional(),
});

// export type Book = {
//   expand: {
//     bookWork: BookWork;
//   };
//   bookWork: BookWork;
//   subTitle: string;
//   description: string;
// };
