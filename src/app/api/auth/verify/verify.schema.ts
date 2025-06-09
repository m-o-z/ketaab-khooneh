import { z } from "zod";

export const VerifyOTPRequestSchema = z.object({
  otpId: z.string().min(4, "Username should have at least 4 character"),
  password: z
    .string({ required_error: "Password should be provided" })
    .min(8)
    .regex(
      /^.{8,}$/,
      "Password must be at least 8 characters long and include at least one special character.",
    ),
  httpOnly: z.boolean({}).optional(),
});

export type VerifyOTPRequestPayload = z.infer<typeof VerifyOTPRequestSchema>;
