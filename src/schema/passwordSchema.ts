import { z } from "zod";

export const passwordSchema = z
  .string({ required_error: "Password should be provided" })
  .min(4)
  .regex(/^.{4,}$/, "Password should be at least 4 character");
