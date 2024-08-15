import { User } from "@/types";

export const getUserFullName = (user?: User) =>
  user ? [user.firstName || "", user.lastName || ""].join(" ") : "-";
