import { detectTextLanguage } from "@/utils/text";

const DirectionAwareText = ({ children }: { children: string | number }) => {
  if (typeof children !== "string" && typeof children !== "number") {
    throw new Error(
      "TextOnlyComponent only accepts text (string or number) as children.",
    );
  }

  const language = detectTextLanguage(String(children));

  if (language === "persian") {
    return (
      <div className="text-right" dir="rtl">
        {children}
      </div>
    );
  }
  return (
    <div className="text-left" dir="ltr">
      {children}
    </div>
  );
};

export default DirectionAwareText;
