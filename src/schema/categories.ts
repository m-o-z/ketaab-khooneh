import { z } from "zod";
import type { BookWorkDB } from "./bookWorks"; // Use 'import type' for the type
import { BookWorkDBSchema } from "./bookWorks"; // Regular import for the schema value
import { FlexibleDateTime } from "./common/date";
import PocketBasePublicService from "@/services/PocketBasePublicService";

// For query params - this schema is fine as is.
export const categoriesSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(20),
  skipTotal: z.coerce.boolean().default(true),
});
export type CategoriesSchema = z.infer<typeof categoriesSchema>;

export type CategoryDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  label: string;
  slug: string;
  category_icon: string | null;
  created: Date | string;
  updated: Date | string;
  expand?: {
    book_works_via_categories?: BookWorkDB[];
  };
};

export type CategoryCore = {
  id: string;
  label: string;
  slug: string;
  categoryIcon: string;
};

// 2. Define the Zod schemas and explicitly annotate them.
export const CategoryDBSchema: z.ZodType<CategoryDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  label: z.string().min(1),
  slug: z.string().min(1),
  category_icon: z.string().nullable(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  expand: z
    .object({
      // 3. Use z.lazy for the circular reference at runtime.
      book_works_via_categories: z
        .lazy(() => z.array(BookWorkDBSchema))
        .optional(),
    })
    .optional(),
});

export const CategoryCoreSchema: z.ZodType<
  CategoryCore,
  z.ZodTypeDef,
  CategoryDB
> = CategoryDBSchema.transform((data) => {
  let categoryIcon = "/public/default/category-icon.png";
  if (data.category_icon) {
    categoryIcon = PocketBasePublicService.Client().files.getURL(
      data,
      data.category_icon,
    );
  }
  return {
    id: data.id,
    label: data.label,
    slug: data.slug, // Kept your original logic where slug is from the DB
    categoryIcon,
  };
});

// 4. Refine DTOs to be more direct and idiomatic.
// If the DTO is the same as the Core object, just assign the schema directly.
export const CategoryDTOSchema = z
  .custom<CategoryCore>()
  .transform((data) => data);
export type CategoryDTO = z.infer<typeof CategoryDTOSchema>;
