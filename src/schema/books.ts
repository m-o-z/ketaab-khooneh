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
import {
  BorrowBriefDTO,
  BorrowBriefDTOSchema,
  BorrowCore,
  BorrowCoreSchema,
  BorrowDB,
  BorrowDBSchema,
} from "./borrows";
import { CategoryDTO, CategoryDTOSchema } from "./categories";

// 1. Correct the BookDB type to match the schema's use of .default()
export type BookDB = {
  id: string;
  bookWork: string;
  collectionId: string;
  collectionName: string;
  edition?: string;
  coverImage?: string[];
  status: "UNAVAILABLE" | "AVAILABLE" | "DAMAGED";
  totalCount: number;
  availableCount: number;
  releaseYear: string;
  language: "ENGLISH" | "PERSIAN";
  subTitle: string;
  description: string;
  userBorrows?: BorrowDB[];
  expand?: {
    bookWork?: BookWorkDB;
    borrows_via_book?: BorrowDB[];
  };
};

export type BookCore = {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  status: "UNAVAILABLE" | "AVAILABLE" | "DAMAGED";
  totalCount: number;
  availableCount: number;
  releaseYear: string;
  edition?: string;
  coverImage?: string[];
  language: "ENGLISH" | "PERSIAN";
  bookWork: BookWorkCore | null;
  activeBorrows: BorrowCore[];
  previousBorrows: BorrowCore[];
};

// 2. The Zod schema definitions remain the same
export const BookDBSchema: z.ZodType<BookDB> = z.object({
  id: z.string(),
  bookWork: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  edition: z.string().default("N/A"),
  coverImage: z.array(z.string()).default([]),
  status: z.enum(["UNAVAILABLE", "AVAILABLE", "DAMAGED"]),
  totalCount: z.number(),
  availableCount: z.number(),
  releaseYear: z.string(),
  language: z.enum(["ENGLISH", "PERSIAN"]),
  subTitle: z.string(),
  description: z.string(),
  userBorrows: z.lazy(() => BorrowDBSchema.array()).optional(),
  expand: z
    .object({
      bookWork: z.lazy(() => BookWorkDBSchema).optional(),
      borrows_via_book: z
        .lazy(() => BorrowDBSchema.array())
        .optional()
        .default([]),
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
      userBorrows,
    } = data;

    let bookWork: null | BookWorkCore = null;
    let activeBorrows: BorrowCore[] = [];
    let previousBorrows: BorrowCore[] = [];
    if (expand?.bookWork) {
      bookWork = BookWorkCoreSchema.parse(expand.bookWork);
    }

    if (userBorrows) {
      const allBorrows = BorrowCoreSchema.array().parse(userBorrows);
      activeBorrows = allBorrows.filter(
        (item) => item.status === "ACTIVE" || item.status === "EXTENDED",
      );
      previousBorrows = allBorrows.filter(
        (item) => !(item.status === "ACTIVE" || item.status === "EXTENDED"),
      );
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
      activeBorrows,
      previousBorrows,
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

  let authors: AuthorBriefDTO[] = null!;
  let categories: CategoryDTO[] = null!;
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
    activeBorrows: activeBorrowsCore,
    previousBorrows: previousBorrowsCore,
  } = data;
  let authors: AuthorDTO[] | null = null;
  let categories: CategoryDTO[] | null = null;
  let activeBorrow: BorrowBriefDTO | null = null;
  let previousBorrows: BorrowBriefDTO[] | null = [];

  if (bookWork?.authors) {
    const result = AuthorDTOSchema.array().safeParse(bookWork.authors);
    if (result.success) authors = result.data;
  }

  if (bookWork?.categories) {
    const result = CategoryDTOSchema.array().safeParse(bookWork.categories);
    if (result.success) categories = result.data;
  }

  if (activeBorrowsCore && activeBorrowsCore.length) {
    activeBorrow = BorrowBriefDTOSchema.parse(activeBorrowsCore[0]);
  }

  if (previousBorrowsCore && previousBorrowsCore.length) {
    previousBorrows = BorrowBriefDTOSchema.array().parse(previousBorrowsCore);
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
    activeBorrow,
    previousBorrows,
  };
});
export type BookDTO = z.infer<typeof BookDTOSchema>;

export const parseBooksQuery = (books: any) => {
  const booksCore = BookCoreSchema.array().parse(books);
  return booksCore;
};
