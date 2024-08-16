import React from "react";
import { User } from "@/types";
import { Avatar, Button, Flex, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { getUserFullName } from "@/app/utils/users";
import { capitalizeName } from "@/utils/name";

type Props = {
  user: User;
  color: string;
};
const UserPreview = ({ user, color }: Props) => {
  const theme = useMantineTheme();
  const fullName = capitalizeName(getUserFullName(user));
  return (
    <Link href={`/user/${user.id}`}>
      <Button
        color={color ?? theme.colors.gray[5]}
        size="compact-md"
        autoContrast
        variant="transparent"
      >
        <Flex gap="xs" align={"center"}>
          <Avatar src={user.image} size="sm" name={fullName} color="initials" />
          <Text>{fullName}</Text>
        </Flex>
      </Button>
    </Link>
  );
};

export default UserPreview;
