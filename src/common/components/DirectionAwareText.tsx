import { detectTextLanguage } from "@/utils/text";
import clsx from "clsx";

type Props = {
  children: string | number;
  noAlignment?: boolean;
  className?: string;
};
const DirectionAwareText = ({
  children,
  noAlignment = false,
  className,
}: Props) => {
  if (typeof children !== "string" && typeof children !== "number") {
    throw new Error(
      "TextOnlyComponent only accepts text (string or number) as children.",
    );
  }

  const language = detectTextLanguage(String(children));

  if (language === "persian") {
    return (
      <div
        className={clsx(
          {
            "text-right": !noAlignment,
          },
          className,
        )}
        dir="rtl"
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={clsx(
        {
          "text-left": !noAlignment,
        },
        className,
      )}
      dir="ltr"
    >
      {children}
    </div>
  );
};

export default DirectionAwareText;
