import React from "react";
import { User } from "@/types";
import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { getUserFullName } from "@/app/utils/users";

type Props = {
  user: User;
};
const UserPreview = ({ user }: Props) => {
  const fullName = getUserFullName(user);
  return (
    <Link href={`/user/${user.id}`}>
      <Flex gap="xs">
        <Avatar src={user.image} size="sm" name={fullName} color="initials" />
        <Text size="sm">{fullName}</Text>
      </Flex>
    </Link>
  );
};

export default UserPreview;
