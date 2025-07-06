import { z } from "zod";

import { emailSchema } from "@/schema/common/email";
import { passwordSchema } from "@/schema/common/passwordSchema";

export const VerifyOTPRequestSchema = z.object({
  otpId: z.string().min(4, "Username should have at least 4 character"),
  password: passwordSchema,
  email: emailSchema.optional(),
  httpOnly: z.boolean({}).optional(),
});

export type VerifyOTPRequestPayload = z.infer<typeof VerifyOTPRequestSchema>;
