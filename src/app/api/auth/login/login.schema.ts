import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().min(4, "Username should have at least 4 character"),
  password: z
    .string({ required_error: "Password should be provided" })
    .min(8)
    .regex(
      /^(?=.*[!@#$%^&*()_+]).{8,}$/,
      "Password must be at least 8 characters long and include at least one special character.",
    ),
  httpOnly: z.boolean({}).optional(),
});

export type LoginRequestPayload = z.infer<typeof LoginRequestSchema>;
