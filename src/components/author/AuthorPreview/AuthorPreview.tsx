import React from "react";
import { Author } from "@/types";
import { Avatar, Button, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { capitalizeName } from "@/utils/name";
type Props = {
  author: Author;
};
const AuthorPreview = ({ author }: Props) => {
  return (
    <Button
      size="compact-md"
      variant="transparent"
      color="gray.4"
      style={{
        paddingInline: 0,
      }}
    >
      <Link href={`/author/${author.id}`}>
        <Flex gap="xs">
          <Avatar
            src={author.image}
            size="sm"
            name={author.name}
            color="initials"
          />
          <Text fw={500} size="sm" lh={"1.5rem"}>
            {capitalizeName(author.name)}
          </Text>
        </Flex>
      </Link>
    </Button>
  );
};

export default AuthorPreview;
