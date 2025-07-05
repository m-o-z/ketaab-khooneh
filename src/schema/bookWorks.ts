// ./src/schema/bookWorks.ts
import { z } from "zod";
import type { AuthorCore, AuthorDB } from "./authors"; // Use 'import type'
import { AuthorCoreSchema, AuthorDBSchema } from "./authors"; // Regular import for schema values
import {
  CategoryCore,
  CategoryCoreSchema,
  CategoryDBSchema,
} from "./categories";

// 1. Define the TypeScript types first.
export type BookWorkDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  categories: string[];
  authors: string[];
  expand?: {
    authors?: z.infer<typeof AuthorDBSchema>[]; // Reference the TYPE here
    categories?: z.infer<typeof CategoryDBSchema>[];
  };
};

export type BookWorkCore = {
  id: string;
  title: string;
  authors: AuthorCore[] | null;
  categories: CategoryCore[] | null;
};

// 2. Define the Zod schemas with explicit type annotations.
export const BookWorkDBSchema: z.ZodType<BookWorkDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  title: z.string(),
  categories: z.array(z.string()),
  authors: z.array(z.string()),
  expand: z
    .object({
      // 3. Use z.lazy with the SCHEMA const here.
      authors: z.lazy(() => z.array(AuthorDBSchema).default([])),
      categories: z.lazy(() => z.array(CategoryDBSchema).default([])),
    })
    .optional(),
});

export const BookWorkCoreSchema: z.ZodType<
  BookWorkCore,
  z.ZodTypeDef,
  BookWorkDB
> = BookWorkDBSchema.transform((data) => {
  const { id, title, expand } = data;
  let authors: AuthorCore[] | null = null;
  let categories: CategoryCore[] | null = null;

  if (expand?.authors) {
    // Since AuthorCoreSchema is also a transform, we parse the raw DB data
    const result = z.array(AuthorCoreSchema).safeParse(expand.authors);
    if (result.success) {
      authors = result.data;
    }
  }

  if (expand?.categories) {
    const result = z.array(CategoryCoreSchema).safeParse(expand.categories);
    if (result.success) {
      categories = result.data;
    }
  }

  return {
    id,
    title,
    authors,
    categories,
  };
});
