import { z } from "zod";
import { BookCore, BookCoreSchema, BookDBSchema } from "./books";
import { UserCore, UserCoreSchema, UserDBSchema } from "./user";
import { FlexibleDateTime } from "./common/date";

// =============================================================
// BORROW SCHEMAS
// =============================================================

/**
 * BorrowDBSchema: Represents the exact structure of a Borrow record
 * as stored in the PocketBase database, including all system fields
 * and relation IDs.
 */
export const BorrowDBSchema = z.object({
  id: z.string(),
  book: z.string(), // Relation to 'books' collection, stored as a string ID
  user: z.string(), // Relation to 'users' collection, stored as a string ID
  borrowDate: FlexibleDateTime,
  dueDate: FlexibleDateTime,
  returnDate: FlexibleDateTime.optional(),
  status: z.enum(["ACTIVE", "RETURNED", "RETURNED_LATE", "EXTENDED"]),
  extendedCount: z.number().int().min(0).optional(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  // expand
  expand: z
    .object({
      book: BookDBSchema,
      user: UserDBSchema,
    })
    .optional(),
});

export type BorrowDB = z.infer<typeof BorrowDBSchema>;

/**
 * BorrowCoreSchema: Defines the essential fields for creating or updating a Borrow record.
 * It excludes system-managed fields ('id', 'created', 'updated').
 * 'returnDate' and 'extendedCount' are included as they can be updated by the application logic.
 */
export const BorrowCoreSchema = BorrowDBSchema.pick({
  id: true,
  book: true,
  user: true,
  borrowDate: true,
  dueDate: true,
  returnDate: true,
  status: true,
  extendedCount: true,
  expand: true,
  created: true,
  updated: true,
}).transform((data) => {
  let book: BookCore | null = null;
  let user: UserCore | null = null;

  if (data.expand) {
    book = BookCoreSchema.parse(data.expand.book);
    user = UserCoreSchema.parse(data.expand.user);
  }
  return {
    bookId: data.book,
    userId: data.user,
    borrowDate: data.borrowDate,
    dueDate: data.dueDate,
    returnDate: data.returnDate,
    status: data.status,
    extendedCount: data.extendedCount,
    user,
    book,
  };
});

export type BorrowCore = z.infer<typeof BorrowCoreSchema>;

/**
 * BorrowDTOSchema: Represents the Data Transfer Object for a Borrow record,
 * typically what's sent to the client. It extends BorrowCoreSchema with
 * read-only identifiers and timestamps.
 */
export const BorrowDTOSchema = BorrowCoreSchema.transform((data) => {
  const { userId, bookId, ...response } = data;
  return response;
});

export type BorrowDTO = z.infer<typeof BorrowDTOSchema>;
