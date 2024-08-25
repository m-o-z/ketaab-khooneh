import React from "react";
import { User } from "@/types";
import { Avatar, Button, Flex, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";

type Props = {
  user: User;
  color?: string;
};
const UserPreview = ({ user, color }: Props) => {
  const theme = useMantineTheme();

  return (
    <Link href={`/user/${user.id}`}>
      <Button
        color={color ?? theme.colors.gray[5]}
        size="compact-md"
        autoContrast
        variant="transparent"
      >
        <Flex gap="xs" align={"center"}>
          <Avatar
            src={user.avatar}
            size="sm"
            name={user.name}
            color="initials"
          />
          <Text>{user.name}</Text>
        </Flex>
      </Button>
    </Link>
  );
};

export default UserPreview;
