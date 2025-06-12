import { emailSchema } from "@/schema/email";

export default function validateEmail(emailString?: string | null) {
  if (!emailString) {
    return null;
  }

  const result = emailSchema.safeParse(emailString);
  if (result.success) {
    return result.data;
  } else {
    return null;
  }
}
