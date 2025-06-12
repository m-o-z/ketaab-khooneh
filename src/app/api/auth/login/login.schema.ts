import { emailSchema } from "@/schema/email";
import { z } from "zod";

export const RequestOTPRequestSchema = z.object({
  email: emailSchema,
});

export type RequestOTPRequestPayload = z.infer<typeof RequestOTPRequestSchema>;
