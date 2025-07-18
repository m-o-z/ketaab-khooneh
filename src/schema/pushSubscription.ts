import { z } from "zod";
import { FlexibleDateTime } from "./common/date";
import { UserCore, UserCoreSchema, UserDB, UserDBSchema } from "./users";

export type PushSubscriptionDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  user: string; // Relation ID
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: Date | string | null;
  created: string | Date;
  updated: string | Date;
  expand?: {
    user?: UserDB;
  };
};

export type PushSubscriptionDBCreatePayload = Pick<
  PushSubscriptionDB,
  "auth" | "p256dh" | "endpoint" | "expirationTime" | "user"
>;

export type PushSubscriptionCore = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: Date | string | null;
  user: UserCore | null;
};

// 2. Define the Zod schema and explicitly annotate it.
export const PushSubscriptionDBSchema: z.ZodType<PushSubscriptionDB> = z.object(
  {
    id: z.string(),
    collectionId: z.string(),
    collectionName: z.string(),
    user: z.string(),
    endpoint: z.string().url(),
    p256dh: z.string(),
    auth: z.string(),
    expirationTime: FlexibleDateTime,
    created: FlexibleDateTime,
    updated: FlexibleDateTime,
    expand: z
      .object({
        // Use z.lazy for the circular reference at runtime.
        user: z.lazy(() => UserDBSchema).optional(),
      })
      .optional(),
  },
);

/**
 * PushSubscriptionCoreSchema: Transforms the raw DB record into a more usable
 * object for backend logic, including the expanded user.
 */
export const PushSubscriptionCoreSchema: z.ZodType<
  PushSubscriptionCore,
  z.ZodTypeDef,
  PushSubscriptionDB
> = PushSubscriptionDBSchema.transform((data) => {
  let user: UserCore | null = null;
  if (data.expand?.user) {
    user = UserCoreSchema.parse(data.expand.user);
  }

  return {
    id: data.id,
    endpoint: data.endpoint,
    p256dh: data.p256dh,
    auth: data.auth,
    expirationTime: data.expirationTime,
    user,
  };
});

export const PushSubscriptionDTOSchema = z
  .custom<PushSubscriptionCore>()
  .transform((data) => data);
export type PushSubscriptionDTO = z.infer<typeof PushSubscriptionDTOSchema>;
