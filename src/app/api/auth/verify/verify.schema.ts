import { z } from "zod";

export const VerifyOTPRequestSchema = z.object({
  otpId: z.string().min(4, "Username should have at least 4 character"),
  password: z
    .string({ required_error: "Password should be provided" })
    .min(4)
    .regex(/^.{4,}$/, "Password should be at least 4 character"),
  httpOnly: z.boolean({}).optional(),
});

export type VerifyOTPRequestPayload = z.infer<typeof VerifyOTPRequestSchema>;
