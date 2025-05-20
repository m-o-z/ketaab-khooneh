import { z } from "zod";

export const categoriesSchema = z.object({
  page: z.number({ coerce: true }).default(1),
  perPage: z.number({ coerce: true }).default(20),
  skipTotal: z.boolean({ coerce: true }).default(true),
});

type CategoriesSchema = z.infer<typeof categoriesSchema>;
