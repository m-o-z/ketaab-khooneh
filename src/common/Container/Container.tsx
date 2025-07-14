"use client";
import { CSSProperties, PropsWithChildren, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { useWindowSize } from "@/hooks/useWindowSize";

type Props = PropsWithChildren & {
  className?: string;
  height?: string;
};
const Container = ({ children, className, height }: Props) => {
  const { width, maxWidth } = useWindowSize();

  let heightClass = "h-[var(--height)]";
  if (height) {
    heightClass = height;
  }
  const maxWidthValue = useMemo(() => {
    return width > maxWidth ? `${maxWidth}px` : `${width}px`;
  }, [width]);

  return (
    <div
      className={twMerge(
        "max-w-[var(--max-width)] mx-auto overflow-y-hidden overscroll-y-none " +
          heightClass,
        className,
      )}
      style={{ "--max-width": maxWidthValue } as CSSProperties}
    >
      {children}
    </div>
  );
};

export default Container;
