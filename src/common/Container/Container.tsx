import { PropsWithChildren } from "react";
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
    <div className={twMerge("max-w-[440px] mx-auto " + heightClass, className)}>
      {children}
    </div>
  );
};

export default Container;
