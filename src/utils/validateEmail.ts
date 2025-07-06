import { emailSchema } from "@/schema/common/email";

export default function validateEmail(emailString?: string | null) {
  if (!emailString) {
    return null;
  }

  const result = emailSchema.safeParse(emailString);
  if (result.success) {
    return result.data;
  }
  return null;
}
