import z from "zod";
import { profileCompleteSchema } from "../complete/route.schema";

export const profileEditSchema = profileCompleteSchema.partial();

export type ProfileEditRequestPayload = z.infer<typeof profileEditSchema>;
