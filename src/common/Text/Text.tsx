import tokens from "@tapsioss/theme/tokens";
import React, { CSSProperties, PropsWithChildren } from "react";

type Tokens = typeof tokens;
type Sizes = keyof Tokens["typography"]["label"];
type Type = keyof Tokens["typography"];
type Props = PropsWithChildren<{
  size?: Sizes;
  type?: Type;
}>;

const Text = ({ type = "label", size = "md", children }: Props) => {
  if (type === "font-family") {
    return null;
  }

  const _type = tokens.typography[type];
  // @ts-expect-error
  const variant = _type[size];

  if (!variant) {
    return null;
  }

  return (
    <div
      style={
        {
          fontFamily: variant.font,
          fontSize: variant.size,
          fontWeight: variant.weight,
          fontStyle: "normal",
          lineHeight: variant.height,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default Text;
