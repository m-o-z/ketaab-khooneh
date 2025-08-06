import { z } from "zod";

// --- Reusable Building Blocks ---

// Regex for Persian letters and spaces
const persianRegex = /^[\u0600-\u06FF\s]+$/;

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// --- Main Profile Schema ---

export const profileCompleteSchema = z.object({
  firstName: z
    .string({ required_error: "وارد کردن نام الزامی است" })
    .min(2, { message: "نام باید حداقل ۲ حرف باشد" })
    .regex(persianRegex, { message: "نام باید فقط شامل حروف فارسی باشد" })
    .transform((val) => val.trim()), // Trim whitespace after validation

  lastName: z
    .string({ required_error: "وارد کردن نام خانوادگی الزامی است" })
    .min(2, { message: "نام خانوادگی باید حداقل ۲ حرف باشد" })
    .regex(persianRegex, {
      message: "نام خانوادگی باید فقط شامل حروف فارسی باشد",
    })
    .transform((val) => val.trim()), // Trim whitespace after validation

  avatar: z
    .instanceof(File)
    .optional()
    .nullable()
    // A single refine block is more efficient
    .refine(
      (file) => {
        // If no file is provided, validation passes
        if (!file) return true;
        // Check both size and type
        return (
          file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      },
      {
        message: "عکس باید با فرمت PNG یا JPG و حجم کمتر از ۲ مگابایت باشد",
      },
    ),
});

export type ProfileCompleteRequestPayload = z.infer<
  typeof profileCompleteSchema
>;
