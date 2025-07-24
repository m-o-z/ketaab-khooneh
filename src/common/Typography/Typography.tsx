import { TokenColorPath } from "@/utils/types/color-path";
import { getTokenValueFromPath } from "@/utils/types/colors";
import tokens from "@tapsioss/theme/tokens";
import clsx from "clsx";
import s from "./Typography.module.scss";
import React, { CSSProperties, PropsWithChildren } from "react";

type TypographyKeys = Exclude<keyof typeof tokens.typography, "font-family">;

type TypographyVariantProps<K extends TypographyKeys> = PropsWithChildren<{
  size: keyof (typeof tokens.typography)[K];
  color?: TokenColorPath;
  className?: string;
  id?: string;
  style?: CSSProperties;
}>;

const createTypographyComponent = <K extends TypographyKeys>(type: K) => {
  const Component = ({
    size,
    color,
    className,
    style,
    children,
    id,
  }: TypographyVariantProps<K>) => {
    const typeMap = tokens.typography[type];
    const variant = typeMap[size] as {
      font: string;
      size: string;
      weight: number;
      height: number;
    };

    const resolvedColor = color ? getTokenValueFromPath(color) : undefined;

    const styles = {
      "--font-family": variant.font,
      "--font-size": variant.size,
      "--font-weight": variant.weight,
      "--font-style": "normal",
      "--line-height": variant.height,
      ...(resolvedColor && { "--color": resolvedColor }),
      ...(style && typeof style === "object" && style),
    } as CSSProperties;

    return (
      <div className={clsx(s.body, className)} style={styles} id={id}>
        {children}
      </div>
    );
  };

  Component.displayName = `Typography.${type[0].toUpperCase()}${type.slice(1)}`;

  return Component;
};

const Typography = {
  Body: createTypographyComponent("body"),
  Label: createTypographyComponent("label"),
  Headline: createTypographyComponent("headline"),
  Display: createTypographyComponent("display"),
};

export default Typography;
