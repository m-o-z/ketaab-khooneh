import { z } from "zod";

import {
  BookBriefDTOSchema,
  BookCore,
  BookCoreSchema,
  BookDB,
  BookDBSchema,
} from "./books";
import { FlexibleDateTime } from "./common/date";
import {
  UserBriefDTOSchema,
  UserCore,
  UserCoreSchema,
  UserDB,
  UserDBSchema,
} from "./users";

export const BorrowDBStatus = {
  ACTIVE: "ACTIVE",
  EXTENDED: "EXTENDED",
  RETURNED: "RETURNED",
  RETURNED_LATE: "RETURNED_LATE",
} as const;

export type BorrowDBStatusKeys =
  (typeof BorrowDBStatus)[keyof typeof BorrowDBStatus];

export const BorrowDBStatusLabels: Record<BorrowDBStatusKeys, string> = {
  ACTIVE: "در حال امانت",
  EXTENDED: "تمدید شده",
  RETURNED: "بازگشتی",
  RETURNED_LATE: "بازگشت با تاخیر",
};
export function getBorrowStatusLabel(status: BorrowDBStatusKeys): string {
  return BorrowDBStatusLabels[status];
}

// 1. Define the TypeScript types first to break the dependency cycle.
export type BorrowDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  book: string; // Relation ID
  user: string; // Relation ID
  borrowDate: string | Date;
  dueDate: string | Date;
  returnDate?: string | Date | null; // Optional and can be null
  status: BorrowDBStatusKeys;
  extendedCount?: number; // Optional
  created: string | Date;
  updated: string | Date;
  expand?: {
    book?: BookDB;
    user?: UserDB;
  };
};

export type BorrowCore = {
  id: string;
  borrowDate: string | Date;
  dueDate: string | Date;
  returnDate?: string | Date | null;
  status: BorrowDBStatusKeys;
  statusFa: string;
  extendedCount: number;
  book: BookCore | null;
  user: UserCore | null;
};

// 2. Define the Zod schemas and explicitly annotate them.
export const BorrowDBSchema: z.ZodType<BorrowDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  book: z.string(),
  user: z.string(),
  borrowDate: FlexibleDateTime,
  dueDate: FlexibleDateTime,
  returnDate: FlexibleDateTime.or(z.literal("")),
  status: z.enum(["ACTIVE", "RETURNED", "RETURNED_LATE", "EXTENDED"]),
  extendedCount: z.number().int().min(0).optional(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  expand: z
    .object({
      // Use z.lazy for the circular references at runtime.
      book: z.lazy(() => BookDBSchema).optional(),
      user: z.lazy(() => UserDBSchema).optional(),
    })
    .optional(),
});

// Use the correct annotation for a transformed schema: ZodType<Output, TypeDef, Input>
export const BorrowCoreSchema: z.ZodType<BorrowCore, z.ZodTypeDef, BorrowDB> =
  BorrowDBSchema.transform((data) => {
    let book: BookCore | null = null;
    if (data.expand?.book) {
      // Safely parse the expanded book data into its Core representation
      const result = BookCoreSchema.safeParse(data.expand.book);
      if (result.success) {
        book = result.data;
      }
    }

    let user: UserCore | null = null;
    if (data.expand?.user) {
      // Safely parse the expanded user data into its Core representation
      const result = UserCoreSchema.safeParse(data.expand.user);
      if (result.success) {
        user = result.data;
      }
    }

    return {
      id: data.id,
      borrowDate: data.borrowDate,
      dueDate: data.dueDate,
      returnDate: data.returnDate,
      status: data.status,
      statusFa: getBorrowStatusLabel(data.status),
      extendedCount: data.extendedCount ?? 0, // Provide a default for the optional field
      book,
      user,
    };
  });

export const BorrowDTOSchema = z.custom<BorrowCore>().transform((data) => data);
export type BorrowDTO = z.infer<typeof BorrowDTOSchema>;

export const BorrowBriefDTOSchema = z.custom<BorrowCore>().transform((data) => {
  const { book, user, ...rest } = data;
  const briefBook = book ? BookBriefDTOSchema.parse(book) : null;
  const briefUser = user ? UserBriefDTOSchema.parse(user) : null;
  return {
    ...rest,
    user: briefUser,
    book: briefBook,
  };
});
export type BorrowBriefDTO = z.infer<typeof BorrowBriefDTOSchema>;

export const isActiveBorrow = (borrowStatus: string) => {
  const list: string[] = [BorrowDBStatus.ACTIVE, BorrowDBStatus.EXTENDED];
  return list.includes(borrowStatus);
};
