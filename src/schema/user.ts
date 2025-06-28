import { z } from "zod";

export const RawUserSchema = z.object({
  id: z.string(),
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  email: z.string().email().optional(), // email might not always be present
  verified: z.boolean(),
  isProfileCompleted: z.boolean(),
  isPunished: z.boolean(),
  punishmentEndAt: z.string(),
});
