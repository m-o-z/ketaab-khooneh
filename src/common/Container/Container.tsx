import { useWindowSize } from "@/hooks/useWindowSize";
import { CSSProperties, PropsWithChildren, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren & {
  className?: string;
  height?: string;
};
const Container = ({ children, className, height }: Props) => {
  const { width } = useWindowSize();

  let heightClass = "h-[var(--height)]";
  if (height) {
    heightClass = height;
  }
  const maxWidth = useMemo(() => {
    return width > 440 ? "440px" : `${width}px`;
  }, [width]);

  return (
    <div
      style={{ "--max-width": maxWidth } as CSSProperties}
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
