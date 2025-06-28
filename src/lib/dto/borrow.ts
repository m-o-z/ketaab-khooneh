// lib/dto.ts (continued)

import { RawBorrowResponseSchema } from "@/schema/borrow";
import { z } from "zod";

export const BorrowDetailsDtoSchema = RawBorrowResponseSchema.transform(
  (data) => {
    console.log({ data });
    // Construct a full name, providing a default if both are empty
    const fullName =
      `${data.expand.user.firstName} ${data.expand.user.lastName}`.trim();

    // Safely get the cover image filename and construct the full URL
    const coverImageFilename = data.expand.book.coverImage[0] ?? null;
    const coverImageUrl = coverImageFilename
      ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${data.expand.book.collectionId}/${data.expand.book.id}/${coverImageFilename}`
      : "/images/placeholder-book-cover.png"; // Provide a safe default placeholder

    return {
      id: data.id,
      status: data.status,
      borrowedOn: data.borrowDate,
      dueOn: data.dueDate,
      returnedOn: data.returnDate,
      book: {
        id: data.expand.book.id,
        edition: data.expand.book.edition,
        status: data.expand.book.status,
        coverImageUrl: coverImageUrl,
      },
      user: {
        id: data.expand.user.id,
        fullName: fullName || "Unnamed User",
        email: data.expand.user.email,
      },
    };
  },
);

export const BorrowDetailsListDtoSchema = z.array(BorrowDetailsDtoSchema);

export type BorrowDetailsListDto = z.infer<typeof BorrowDetailsListDtoSchema>;
