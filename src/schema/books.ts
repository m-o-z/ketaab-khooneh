import pbClient from "@/client/pbClient";
import { z } from "zod";
import { AuthorDTO, AuthorDTOSchema } from "./authors";
import {
  BookWorkCore,
  BookWorkCoreSchema,
  BookWorkDBSchema,
} from "./bookWorks";
import { CategoryDTO, CategoryDTOSchema } from "./categories";

export const BookDBSchema = z.object({
  id: z.string(),
  bookWork: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
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
      bookWork: BookWorkDBSchema.optional(),
    })
    .optional(),
});

export type BookDB = z.infer<typeof BookDBSchema>;

export const BookCoreSchema = BookDBSchema.transform((data) => {
  console.log("here1");
  const {
    id,
    subTitle,
    description,
    status,
    coverImage,
    totalCount,
    availableCount,
    releaseYear,
    edition,
    language,
    expand,
  } = data;

  let bookWork: null | BookWorkCore = null;
  if (expand && "bookWork" in expand) {
    const result = BookWorkCoreSchema.safeParse(expand.bookWork);
    if (result.success) {
      bookWork = result.data;
    }
  }
  const mappedCoverImage = coverImage.map((img) =>
    pbClient().files.getURL(data, img),
  );

  return {
    id,
    title: bookWork ? bookWork.title : "",
    subTitle,
    description,
    status,
    coverImage: mappedCoverImage,
    totalCount,
    availableCount,
    releaseYear,
    edition,
    language,
    bookWork,
  };
});

export type BookCore = z.infer<typeof BookCoreSchema>;

export const BookBriefDTOSchema = z.custom<BookCore>().transform((data) => {
  const {
    id,
    title,
    subTitle,
    availableCount,
    totalCount,
    status,
    bookWork,
    coverImage,
  } = data;

  let authors: AuthorDTO[] = [];
  let categories: CategoryDTO[] = [];
  if (bookWork) {
    authors = AuthorDTOSchema.array().parse(bookWork.authors);
    categories = CategoryDTOSchema.array().parse(bookWork.categories);
  }

  return {
    id,
    title,
    subTitle,
    availableCount,
    totalCount,
    coverImage: coverImage.length
      ? coverImage[0]
      : "/public/default/book-cover.png",
    status,
    authors,
    categories,
  };
});
export type BookBriefDTO = z.infer<typeof BookBriefDTOSchema>;

export const BookDTOSchema = z.custom<BookCore>().transform((data) => {
  const {
    id,
    title,
    subTitle,
    availableCount,
    totalCount,
    status,
    bookWork,
    coverImage,
    description,
    edition,
    language,
    releaseYear,
  } = data;
  let authors: AuthorDTO[] = [];
  let categories: CategoryDTO[] = [];

  if (bookWork?.authors) {
    const result = AuthorDTOSchema.array().safeParse(bookWork.authors);
    if (result.success) {
      authors = result.data;
    }
  }

  if (bookWork?.categories) {
    const result = CategoryDTOSchema.array().safeParse(bookWork.categories);
    if (result.success) {
      categories = result.data;
    }
  }
  return {
    id,
    coverImage: coverImage.length
      ? coverImage
      : "/public/default/book-cover.png",
    title,
    subTitle,
    description,
    edition,
    language,
    releaseYear,
    availableCount,
    totalCount,
    status,
    authors,
    categories,
  };
});
export type BookDTO = z.infer<typeof BookDTOSchema>;

export const parseBooksQuery = (books: any) => {
  const booksCore = BookCoreSchema.array().parse(books);

  return booksCore;
};
