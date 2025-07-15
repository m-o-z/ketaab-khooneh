import tokens from "@tapsioss/theme/tokens";
import { TokenColorPath } from "./color-path";

export function getTokenValueFromPath(
  path: TokenColorPath,
): string | undefined {
  const parts = path.split(".");
  let current: any = tokens;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }

  return typeof current === "string" ? current : undefined;
}
