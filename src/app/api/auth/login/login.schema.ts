import { z } from "zod";

export const RequestOTPRequestSchema = z.object({
  email: z.string().min(4, "Username should have at least 4 character"),
});

export type RequestOTPRequestPayload = z.infer<typeof RequestOTPRequestSchema>;
