import React from "react";
import { Author } from "@/types";
import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
type Props = {
  author: Author;
};
const AuthorPreview = ({ author }: Props) => {
  return (
    <Link href={`/author/${author.id}`}>
      <Flex gap="xs">
        <Avatar
          src={author.image}
          size="sm"
          name={author.name}
          color="initials"
        />
        <Text size="sm">{author.name}</Text>
      </Flex>
    </Link>
  );
};

export default AuthorPreview;
