import { Box, Flex } from "@mantine/core";
import tokens from "@tapsioss/theme/tokens";
import clsx from "clsx";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";

import { toBeRendered } from "@/utils/render";

type Props = {
  renderIcon: ReactNode | (() => ReactNode);
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};
const ProfileItem = ({
  children,
  renderIcon,
  onClick,
  className,
  style = {},
}: PropsWithChildren<Props>) => {
  return (
    <Flex
      align="center"
      className={clsx(
        "cursor-pointer w-full space-x-2",
        className ? className : "",
      )}
      columnGap="xs"
      style={{ ...style }}
      onClick={onClick}
    >
      <div className="w-6 h-6 shrink-0">{toBeRendered(renderIcon)}</div>
      <div className="text-inherit font-medium grow text-ellipsis whitespace-nowrap overflow-hidden">
        {children}
      </div>
    </Flex>
  );
};

export default ProfileItem;
