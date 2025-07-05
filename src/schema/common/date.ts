import { z } from "zod";

export const DateTimeSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    // Replace space with 'T' if needed
    return new Date(val.replace(" ", "T"));
  }
  return val;
}, z.date());

export const FlexibleDateTime = z.preprocess((val) => {
  if (typeof val === "string") {
    // Normalize " " to "T" if needed
    const normalized = val.includes(" ") ? val.replace(" ", "T") : val;
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return val;
}, z.date());
