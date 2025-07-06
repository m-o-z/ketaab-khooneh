import { z } from "zod";

import PocketBasePublicService from "@/services/PocketBasePublicService";

import {
  AuthorBriefDTO,
  AuthorBriefDTOSchema,
  AuthorDTO,
  AuthorDTOSchema,
} from "./authors";
import {
  BookWorkCore,
  BookWorkCoreSchema,
  BookWorkDB,
  BookWorkDBSchema,
} from "./bookWorks";
import { CategoryDTO, CategoryDTOSchema } from "./categories";

// 1. Correct the BookDB type to match the schema's use of .default()
export type BookDB = {
  id: string;
  bookWork: string;
  collectionId: string;
  collectionName: string;
  edition?: string;
  coverImage?: string[];
  status:
    | "UNAVAILABLE"
    | "AVAILABLE"
    | "BORROWED"
    | "RESERVED_BY_OTHERS"
    | "RESERVED_BY_ME";
  totalCount: number;
  availableCount: number;
  releaseYear: string;
  language: "ENGLISH" | "PERSIAN";
  subTitle: string;
  description: string;
  expand?: {
    bookWork?: BookWorkDB;
  };
};

export type BookCore = {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  status:
    | "UNAVAILABLE"
    | "AVAILABLE"
    | "BORROWED"
    | "RESERVED_BY_OTHERS"
    | "RESERVED_BY_ME";
  totalCount: number;
  availableCount: number;
  releaseYear: string;
  edition?: string;
  coverImage?: string[];
  language: "ENGLISH" | "PERSIAN";
  bookWork: BookWorkCore | null;
};

// 2. The Zod schema definitions remain the same
export const BookDBSchema: z.ZodType<BookDB> = z.object({
  id: z.string(),
  bookWork: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  edition: z.string().default("N/A"),
  coverImage: z.array(z.string()).default([]),
  status: z.enum([
    "UNAVAILABLE",
    "AVAILABLE",
    "BORROWED",
    "RESERVED_BY_OTHERS",
    "RESERVED_BY_ME",
  ]),
  totalCount: z.number(),
  availableCount: z.number(),
  releaseYear: z.string(),
  language: z.enum(["ENGLISH", "PERSIAN"]),
  subTitle: z.string(),
  description: z.string(),
  expand: z
    .object({
      bookWork: z.lazy(() => BookWorkDBSchema).optional(),
    })
    .optional(),
});

export const BookCoreSchema: z.ZodType<BookCore, z.ZodTypeDef, BookDB> =
  BookDBSchema.transform((data) => {
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
    if (expand?.bookWork) {
      const result = BookWorkCoreSchema.safeParse(expand.bookWork);
      if (result.success) {
        bookWork = result.data;
      }
    }
    const mappedCoverImage = coverImage!.map((img) =>
      PocketBasePublicService.Client().files.getURL(data, img),
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

  let authors: AuthorBriefDTO[];
  let categories: CategoryDTO[];
  if (bookWork?.authors) {
    authors = AuthorBriefDTOSchema.array().parse(bookWork.authors);
  }
  if (bookWork?.categories) {
    categories = CategoryDTOSchema.array().parse(bookWork.categories);
  }

  return {
    id,
    title,
    subTitle,
    availableCount,
    totalCount,
    coverImage: coverImage!.length
      ? coverImage![0]
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
  let authors: AuthorDTO[] | null = null;
  let categories: CategoryDTO[] | null = null;

  if (bookWork?.authors) {
    const result = AuthorDTOSchema.array().safeParse(bookWork.authors);
    if (result.success) authors = result.data;
  }

  if (bookWork?.categories) {
    const result = CategoryDTOSchema.array().safeParse(bookWork.categories);
    if (result.success) categories = result.data;
  }

  return {
    id,
    coverImage: coverImage!.length
      ? coverImage
      : ["/public/default/book-cover.png"],
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
