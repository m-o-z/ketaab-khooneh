import tokens from "@tapsioss/theme/tokens";

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

export type ColorPaths<T, Prev extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${Prev}${K & string}`
    : T[K] extends object
      ? Join<Prev, ColorPaths<T[K], `${K & string}.`>>
      : never;
}[keyof T];

type DotPaths<T> = {
  [K in keyof T]: T[K] extends string
    ? `${K & string}`
    : T[K] extends object
      ? Join<K & string, DotPaths<T[K]>>
      : never;
}[keyof T];

// Now infer all paths like "color.content.primary", etc.
export type TokenColorPath = Join<"color", DotPaths<(typeof tokens)["color"]>>;
