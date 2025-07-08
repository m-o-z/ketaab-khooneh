import { ReactNode, isValidElement } from "react";

type ToBeRenderedInput = ReactNode | (() => ReactNode);

export function toBeRendered(input: ToBeRenderedInput): ReactNode {
  const result = typeof input === "function" ? input() : input;

  if (
    result === null ||
    result === undefined ||
    typeof result === "boolean" ||
    (typeof result === "object" &&
      !isValidElement(result) &&
      !Array.isArray(result))
  ) {
    return null;
  }

  return result;
}
