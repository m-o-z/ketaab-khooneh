"use client";
import { Flex } from "@mantine/core";
import { Avatar, Skeleton } from "@tapsioss/react-components";
import Link from "next/link";

import PreviewBase from "@/common/components/PreviewBase";
import { AuthorDTO } from "@/schema/authors";

type Props = {
  author: AuthorDTO;
};

const AuthorPreview = ({ author }: Props) => {
  return (
    <PreviewBase
      imageUrl={author.authorImg}
      title={author.authorImg}
      url={`/author/${author.id}`}
    />
  );
};

AuthorPreview.Compact = function Compact({ author }: Props) {
  return (
    <PreviewBase.Compact
      imageUrl={author.authorImg}
      title={author.name}
      url={`/authors/${author.id}`}
    />
  );
};

AuthorPreview.List = function List({ author }: Props) {
  return (
    <Link href={`/authors/${author.id}`}>
      <Flex align="center" gap="sm">
        <Avatar alt={author.name} image={author.authorImg} />
        <p>{author.name}</p>
      </Flex>
    </Link>
  );
};

AuthorPreview.Loading = function Loading() {
  return (
    <Flex align="center" gap="sm">
      <Skeleton height="40px" variant="circular" width="40px" />
      <Skeleton height="28px" variant="rectangular" width="100px" />
    </Flex>
  );
};
export default AuthorPreview;
