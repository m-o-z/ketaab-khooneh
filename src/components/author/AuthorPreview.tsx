"use client";
import PreviewBase from "@/common/components/PreviewBase";
import { AuthorDTO } from "@/schema/authors";
import { Flex } from "@mantine/core";
import { Avatar, Skeleton } from "@tapsioss/react-components";
import Link from "next/link";

type Props = {
  author: AuthorDTO;
};

const AuthorPreview = ({ author }: Props) => {
  return (
    <PreviewBase
      title={author.authorImg}
      imageUrl={author.authorImg}
      url={`/author/${author.id}`}
    />
  );
};

AuthorPreview.Compact = function Compact({ author }: Props) {
  return (
    <PreviewBase.Compact
      title={author.name}
      imageUrl={author.authorImg}
      url={`/authors/${author.id}`}
    />
  );
};

AuthorPreview.List = function List({ author }: Props) {
  return (
    <Link href={`/authors/${author.id}`}>
      <Flex align="center" gap="sm">
        <Avatar image={author.authorImg} alt={author.name} />
        <p>{author.name}</p>
      </Flex>
    </Link>
  );
};

AuthorPreview.Loading = function Loading() {
  return (
    <Flex align="center" gap="sm">
      <Skeleton variant="circular" width="40px" height="40px" />
      <Skeleton variant="rectangular" width="100px" height="28px" />
    </Flex>
  );
};
export default AuthorPreview;
