import { CSSProperties, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren & {
  className?: string;
  height?: string;
};
const Container = ({ children, className, height }: Props) => {
  let heightClass = "h-[var(--height)]";
  if (height) {
    heightClass = height;
  }
  return (
    <div
      style={{ "--max-width": "440px" } as CSSProperties}
      className={twMerge(
        "max-w-[var(--max-width)] mx-auto overflow-y-hidden overscroll-y-none " +
          heightClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
