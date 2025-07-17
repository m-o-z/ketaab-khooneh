import { FlexibleDateTime } from "@/schema/common/date";
import z from "zod";

export const pushSubscriptionPayloadSchema = z.object({
  endpoint: z.string(),
  expirationTime: FlexibleDateTime.nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type PushSubscriptionPayload = z.infer<
  typeof pushSubscriptionPayloadSchema
>;
