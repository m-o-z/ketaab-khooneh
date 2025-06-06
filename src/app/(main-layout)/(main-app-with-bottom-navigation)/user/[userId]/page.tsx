"use client";
import React from "react";
import { useParams } from "next/navigation";
import { users } from "@/mock";
import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
// TODO: fix style
const Page = () => {
  const { userId } = useParams();
  const user = users.find((user) => user.id === userId);
  return (
    <div>
      {user && (
        <Flex direction="column" gap="xs">
          <Avatar
            size="xl"
            src={user.avatar}
            name={user.name}
            color="initials"
          />
          <Text>{user.name}</Text>
          <Link href={`mailto:${user.email}`}>
            <Text>{user.email}</Text>
          </Link>
        </Flex>
      )}
    </div>
  );
};

export default Page;
