import z from "zod";

// Persian regex for names (letters and spaces)
export const persianRegex = /^[\u0600-\u06FF\s]+$/;
export const profileCompleteSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "نام باید حداقل ۲ حرف باشد" })
    .regex(persianRegex, { message: "نام باید فقط حروف فارسی باشد" }),
  lastName: z
    .string()
    .min(2, { message: "نام خانوادگی باید حداقل ۲ حرف باشد" })
    .regex(persianRegex, { message: "نام خانوادگی باید فقط حروف فارسی باشد" }),
  avatar: z
    .instanceof(File)
    .refine((file) => file && ["image/jpeg", "image/png"].includes(file.type), {
      message: "فرمت عکس باید JPG یا PNG باشد",
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: "حجم عکس نباید بیشتر از ۲ مگابایت باشد",
    })
    .optional()
    .nullable(),
});

export type ProfileCompleteRequestPayload = z.infer<
  typeof profileCompleteSchema
>;
