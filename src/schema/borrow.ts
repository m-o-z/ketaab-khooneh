import { z } from "zod";
import { RawBookSchema } from "./books";
import { RawUserSchema } from "./user";

export const RawBorrowResponseSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  status: z.enum(["ACTIVE", "RETURNED", "RETURNED_LATE", "EXTENDED"]),
  borrowDate: z.coerce.date(), // z.coerce.date() automatically converts string to Date
  dueDate: z.coerce.date(),
  returnDate: z
    .string()
    .transform((val) => (val === "" ? null : new Date(val))), // Handle empty string for date
  expand: z.object({
    book: RawBookSchema,
    user: RawUserSchema,
  }),
});
