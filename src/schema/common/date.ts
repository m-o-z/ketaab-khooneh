import { z } from "zod";

export const DateTimeSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    // Replace space with 'T' if needed
    return new Date(val.replace(" ", "T"));
  }
  return val;
}, z.date());

// export const FlexibleDateTime = z.preprocess((val) => {
//   if (typeof val === "string") {
//     // Normalize " " to "T" if needed
//     const normalized = val.includes(" ") ? val.replace(" ", "T") : val;
//     const date = new Date(normalized);
//     return isNaN(date.getTime()) ? undefined : date;
//   }
//   return val;
// }, z.date());

// A specific schema to handle and normalize your string format
const CustomStringToDate = z.string().transform((val, ctx) => {
  // Your custom transformation logic is preserved here
  const normalized = val.replace(" ", "T");
  const date = new Date(normalized);

  // Add a specific error if the normalized string is still not a valid date
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      message: `Invalid date string: "${val}"`,
    });
    return z.NEVER;
  }

  return date;
});

// The final schema accepts either a valid Date object or a string that can be transformed
export const FlexibleDateTime = z.union([z.date(), CustomStringToDate]);
