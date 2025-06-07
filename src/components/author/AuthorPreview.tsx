"use client";
import React from "react";
import { Author } from "@/types";
import { capitalizeName } from "@/utils/string";
import pbClient from "@/client/pbClient";
import PreviewBase from "@/common/components/PreviewBase";
import { Flex } from "@mantine/core";
import { Avatar, Skeleton } from "@tapsioss/react-components";
import Link from "next/link";

type Props = {
  author: Author;
};

const getAuthorName = (author: Author) =>
  capitalizeName(author.name) +
  (author.nick_name ? ` (${author.nick_name})` : "");

const AuthorPreview = ({ author }: Props) => {
  return (
    <PreviewBase
      title={getAuthorName(author)}
      imageUrl={
        author.author_img
          ? pbClient().files.getUrl(author, author.author_img)
          : ""
      }
      url={`/author/${author.id}`}
    />
  );
};

AuthorPreview.Compact = function Compact({ author }: Props) {
  return (
    <PreviewBase.Compact
      title={getAuthorName(author)}
      imageUrl={
        author.author_img
          ? pbClient().files.getUrl(author, author.author_img)
          : ""
      }
      url={`/authors/${author.id}`}
    />
  );
};

AuthorPreview.List = function List({ author }: Props) {
  return (
    <Link href={`/authors/${author.id}`} passHref>
      <Flex align="center" gap="sm">
        <Avatar
          image={pbClient().files.getUrl(author, author.author_img ?? "")}
          alt={author.name}
        />
        <p>{getAuthorName(author)}</p>
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
