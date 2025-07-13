import { z } from "zod";

import PocketBasePublicService from "@/services/PocketBasePublicService";

import type { BorrowDB } from "./borrows"; // Use 'import type' for the type
import { BorrowDBSchema, BorrowCoreSchema, isActiveBorrow } from "./borrows"; // Regular import for the schema value
import { FlexibleDateTime } from "./common/date";

// 1. Define the TypeScript types first to break the dependency cycle.
export type UserDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  password?: string;
  tokenKey?: string;
  email: string;
  emailVisibility?: boolean;
  verified: boolean;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isPunished: boolean;
  punishmentEndAt?: string | Date | null;
  isProfileCompleted: boolean;
  created: string | Date;
  updated: string | Date;
  expand?: {
    borrows_via_user?: BorrowDB[];
  };
};

export type UserCore = {
  id: string;
  email: string;
  avatar: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  borrows: z.infer<typeof BorrowCoreSchema>[];
  isProfileCompleted: boolean;
  isPunished: boolean;
  punishmentEndAt?: string | Date | null;
  verified: boolean;
  activeBorrows: z.infer<typeof BorrowCoreSchema>[];
};

// 2. Define the Zod schemas and explicitly annotate them.
export const UserDBSchema: z.ZodType<UserDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  password: z.string().optional(),
  tokenKey: z.string().optional(),
  email: z.string().email().or(z.literal("")),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  avatar: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  isPunished: z.boolean(),
  punishmentEndAt: FlexibleDateTime.or(z.literal("")),
  isProfileCompleted: z.boolean(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  expand: z
    .object({
      // Use z.lazy for the circular reference at runtime.
      borrows_via_user: z.lazy(() => z.array(BorrowDBSchema)).optional(),
    })
    .optional(),
});

// Use the correct annotation for a transformed schema: ZodType<Output, TypeDef, Input>
export const UserCoreSchema: z.ZodType<UserCore, z.ZodTypeDef, UserDB> =
  UserDBSchema.transform((data) => {
    let borrows: z.infer<typeof BorrowCoreSchema>[] = [];
    if (data.expand?.["borrows_via_user"]) {
      borrows = z
        .array(BorrowCoreSchema)
        .parse(data.expand["borrows_via_user"]);
    }

    let avatarUrl = "/public/default/avatar.png";
    if (data.avatar) {
      avatarUrl = PocketBasePublicService.Client().files.getURL(
        data,
        data.avatar,
      );
    }

    return {
      id: data.id,
      email: data.email,
      avatar: avatarUrl,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      isProfileCompleted: data.isProfileCompleted,
      isPunished: data.isPunished,
      punishmentEndAt: data.punishmentEndAt,
      verified: data.verified,
      displayName: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      borrows,
      activeBorrows: borrows?.length
        ? borrows.filter((item) => isActiveBorrow(item.status))
        : [],
    };
  });

// For users, the Core object is often a good base for the main DTO.
export const UserDTOSchema = z.custom<UserCore>().transform((data) => {
  return {
    ...data,
    activeBorrowsCount: data.activeBorrows?.length
      ? data.activeBorrows.length
      : 0,
  };
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const UserBriefDTOSchema = z.custom<UserCore>().transform((data) => {
  const { id, displayName, avatar } = data;
  return {
    id,
    displayName,
    avatar,
  };
});
export type UserBriefDTO = z.infer<typeof UserBriefDTOSchema>;
