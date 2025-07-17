import React, { PropsWithChildren, ReactNode } from "react";
import Typography from "../Typography/Typography";

type Props = PropsWithChildren<{
  label: string | ReactNode;
}>;
const SettingGroup = ({ label, children }: Props) => {
  return (
    <div className="space-y-2 w-full">
      <div>
        <Typography.Label size="xs" color="color.content.tertiary">
          {label}
        </Typography.Label>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default SettingGroup;
