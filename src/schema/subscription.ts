import { z } from "zod";
import { FlexibleDateTime } from "./common/date";
import { UserCore, UserCoreSchema, UserDB, UserDBSchema } from "./users";

/**
 * SubscriptionDB: Represents the raw data structure of a 'subscriptions'
 * record directly from the PocketBase database.
 */
export type SubscriptionDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  user: string; // Relation ID to the user who subscribed
  targetCollection: string; // The collection being watched (e.g., 'posts')
  recordId: string; // The specific record ID being watched
  type: "GOT_AVAILABLE"; // The event type (e.g., 'comment_created')
  actor?: string | null; // Relation ID to the user who triggered the event
  created: string | Date;
  updated: string | Date;
  expand?: {
    user?: UserDB;
    actor?: UserDB;
  };
};

/**
 * SubscriptionDBCreatePayload: Defines the fields required to create a new
 * subscription record in the database.
 */
export type CreateSubscriptionPayload = Pick<
  SubscriptionDB,
  "user" | "targetCollection" | "recordId" | "type" | "actor"
>;

export type DeleteSubscriptionPayload = Pick<
  SubscriptionDB,
  "user" | "targetCollection" | "recordId" | "type" | "actor"
>;

export type FindSubscriptionPayload = Pick<
  SubscriptionDB,
  "user" | "targetCollection" | "recordId" | "type" | "actor"
>;

/**
 * SubscriptionCore: A processed, more usable object for backend logic,
 * containing the core subscription data and the expanded user/actor objects.
 */
export type SubscriptionCore = {
  id: string;
  user: UserCore | null;
  targetCollection: string;
  recordId: string;
  type: string;
  actor: UserCore | null;
};

// Define the Zod schema for the raw database record.
export const SubscriptionDBSchema: z.ZodType<SubscriptionDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  user: z.string(),
  targetCollection: z.string(),
  recordId: z.string(),
  type: z.enum(["GOT_AVAILABLE"]),
  actor: z.string().optional().nullable(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  expand: z
    .object({
      // Use z.lazy for circular references at runtime.
      user: z.lazy(() => UserDBSchema).optional(),
      actor: z.lazy(() => UserDBSchema).optional(),
    })
    .optional(),
});

/**
 * SubscriptionCoreSchema: Transforms the raw DB record into a SubscriptionCore object.
 */
export const SubscriptionCoreSchema: z.ZodType<
  SubscriptionCore,
  z.ZodTypeDef,
  SubscriptionDB
> = SubscriptionDBSchema.transform((data) => {
  let user: UserCore | null = null;
  if (data.expand?.user) {
    user = UserCoreSchema.parse(data.expand.user);
  }

  let actor: UserCore | null = null;
  if (data.expand?.actor) {
    actor = UserCoreSchema.parse(data.expand.actor);
  }

  return {
    id: data.id,
    user,
    targetCollection: data.targetCollection,
    recordId: data.recordId,
    type: data.type,
    actor,
  };
});

/**
 * SubscriptionDTOSchema: Defines the final Data Transfer Object (DTO) for a subscription.
 */
export const SubscriptionDTOSchema = z
  .custom<SubscriptionCore>()
  .transform((data) => data);
export type SubscriptionDTO = z.infer<typeof SubscriptionDTOSchema>;
