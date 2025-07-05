import { z } from "zod";
import { AuthorCore, AuthorCoreSchema, AuthorDBSchema } from "./authors";
import {
  CategoryCore,
  CategoryCoreSchema,
  CategoryDBSchema,
} from "./categories";

export const BookWorkDBSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  title: z.string(),
  categories: z.array(z.string()),
  authors: z.array(z.string()),
  expand: z
    .object({
      authors: z.array(AuthorDBSchema).default([]), // TODO: define authors schema
      categories: z.array(CategoryDBSchema).default([]), // TODO: define authors schema
    })
    .optional(),
});

export type BookWorkDB = z.infer<typeof BookWorkDBSchema>;

export const BookWorkCoreSchema = BookWorkDBSchema.transform((data) => {
  const { id, title, expand } = data;
  // TODO: fix authors
  let authors: null | AuthorCore[] = null;
  let categories: null | CategoryCore[] = null;

  if (expand) {
    if ("authors" in expand) {
      const result = z.array(AuthorCoreSchema).safeParse(expand.authors);
      if (result.success) {
        authors = result.data;
      }
    }
    if ("categories" in expand) {
      const result = z.array(CategoryCoreSchema).safeParse(expand.categories);
      if (result.success) {
        categories = result.data;
      }
    }
  }
  return {
    id,
    title,
    authors,
    categories,
  };
});

export type BookWorkCore = z.infer<typeof BookWorkCoreSchema>;
