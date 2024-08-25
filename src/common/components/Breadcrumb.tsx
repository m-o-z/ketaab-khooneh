import React from "react";
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Flex,
  Popover,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  items: { title: string; href: string }[];
};

const Breadcrumb = ({ items }: Props) => {
  return (
    <Breadcrumbs>
      {items.map((item, index) => (
        <Link href={item.href} key={index}>
          <Text size="xs">{item.title}</Text>
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
