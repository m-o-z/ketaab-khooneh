import React from "react";
import { Flex, NavLink, Text } from "@mantine/core";
import Link from "next/link";
import { IconAt } from "@tabler/icons-react";

type Props = {
  title: string;
  url: string;
  icon: typeof IconAt;
};

const SidebarItem = ({ title, url, icon: Icon }: Props) => {
  return (
    <NavLink
      href={url}
      label={
        <Flex align="center" gap="sm">
          <Icon size={20} />
          <Text>{title}</Text>
        </Flex>
      }
      component={Link}
    />
  );
};

export default SidebarItem;
