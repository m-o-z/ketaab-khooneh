import { z } from "zod";

export const RequestOTPRequestSchema = z.object({
  email: z
    .string()
    .min(4, "Email should have at least 4 characters") // Minimum length for the whole email string
    .email("Invalid email format") // Ensures it's a valid email structure
    .endsWith("@tapsi.cab", "Email must be from the tapsi.cab domain"),
});

export type RequestOTPRequestPayload = z.infer<typeof RequestOTPRequestSchema>;
