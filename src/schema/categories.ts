import { z } from "zod";
import { FlexibleDateTime } from "./common/date";
import pbClient from "@/client/pbClient";

export const categoriesSchema = z.object({
  page: z.number({ coerce: true }).default(1),
  perPage: z.number({ coerce: true }).default(20),
  skipTotal: z.boolean({ coerce: true }).default(true),
});

export type CategoriesSchema = z.infer<typeof categoriesSchema>;

export const CategoryDBSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  label: z.string().min(1), // Assuming min 1 character for label, as max/min are 0 in provided data which usually means no specific length constraint other than being present
  slug: z.string().min(1), // Assuming min 1 character for slug
  category_icon: z.string().nullable(), // File field, typically a string representing the filename/URL
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
});

export type CategoryDB = z.infer<typeof CategoryDBSchema>;

export const CategoryCoreSchema = CategoryDBSchema.transform((data) => {
  let categoryIcon = "/public/default/category-icon.png";
  if (data.category_icon) {
    categoryIcon = pbClient().files.getURL(data, data.category_icon);
  }
  return {
    id: data.id,
    label: data.label,
    slug: data.label,
    categoryIcon,
  };
});

export type CategoryCore = z.infer<typeof CategoryCoreSchema>;

export const CategoryDTOSchema = z
  .custom<CategoryCore>()
  .transform((data) => data);

export type CategoryDTO = z.infer<typeof CategoryDTOSchema>;
