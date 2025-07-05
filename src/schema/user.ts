import { z } from "zod";
import { FlexibleDateTime } from "./common/date";

// =============================================================
// USER SCHEMAS
// =============================================================

/**
 * UserDBSchema: Represents the exact structure of a User record
 * as stored in the PocketBase database, including all system and auth-specific fields.
 */
export const UserDBSchema = z.object({
  id: z.string(),
  password: z.string().min(4), // Password hash, not the plain text password
  tokenKey: z.string().min(30).max(60),
  email: z.string().email().or(z.literal("")),
  emailVisibility: z.boolean().optional(),
  verified: z.boolean().optional(),
  avatar: z.string().optional(), // File field, typically a string (filename/URL)
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isPunished: z.boolean().optional(),
  punishmentEndAt: FlexibleDateTime.optional(),
  isProfileCompleted: z.boolean().optional(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
});

export type UserDB = z.infer<typeof UserDBSchema>;

/**
 * UserCoreSchema: Defines the fields a user can typically update in their profile.
 * Excludes system-managed fields (id, created, updated, tokenKey, password, verified)
 * and admin-managed fields like 'isPunished', 'punishmentEndAt'.
 */
export const UserCoreSchema = UserDBSchema.pick({
  id: true,
  email: true, // Email can be updated, but often via a separate flow
  emailVisibility: true,
  avatar: true,
  firstName: true,
  lastName: true,
  isProfileCompleted: true,
  created: true,
  updated: true,
  isPunished: true,
  punishmentEndAt: true,
  verified: true,
});

export type UserCore = z.infer<typeof UserCoreSchema>;

/**
 * UserBriefDTOSchema: A brief Data Transfer Object for a User,
 * suitable for public display (e.g., author name on a post).
 * Derived from UserCoreSchema, extended with 'id'.
 */
export const UserBriefDTOSchema = UserCoreSchema.omit({
  emailVisibility: true,
  isProfileCompleted: true,
  isPunished: true,
  punishmentEndAt: true,
  verified: true,
})
  .transform((data) => ({
    ...data,
    displayName: `${data.firstName} ${data.lastName}`,
  }))
  .transform((data) => {
    const { firstName: _, lastName: __, ...response } = data;
    return response;
  });

export type UserBriefDTO = z.infer<typeof UserBriefDTOSchema>;

/**
 * UserDTOSchema: A detailed Data Transfer Object for a User,
 * typically used when the authenticated user views their own profile.
 * Derived from UserCoreSchema, extended with relevant read-only system fields.
 */
export const UserDTOSchema = UserCoreSchema.extend({
  id: z.string(),
  verified: z.boolean(),
  isPunished: z.boolean().optional(),
  punishmentEndAt: FlexibleDateTime.optional(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
});

export type UserDTO = z.infer<typeof UserDTOSchema>;
