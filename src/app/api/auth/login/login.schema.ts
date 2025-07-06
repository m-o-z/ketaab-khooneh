import { z } from "zod";

import { emailSchema } from "@/schema/common/email";

export const RequestOTPRequestSchema = z.object({
  email: emailSchema,
});

export type RequestOTPRequestPayload = z.infer<typeof RequestOTPRequestSchema>;
