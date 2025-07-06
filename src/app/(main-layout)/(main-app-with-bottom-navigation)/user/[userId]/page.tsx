"use client";
import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import { users } from "@/mock";

// TODO: fix style
const Page = () => {
  const { userId } = useParams();
  const user = users.find((user) => user.id === userId);
  return (
    <div>
      {user && (
        <Flex direction="column" gap="xs">
          <Avatar
            color="initials"
            name={user.name}
            size="xl"
            src={user.avatar}
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
