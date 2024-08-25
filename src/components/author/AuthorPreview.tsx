"use client";
import React from "react";
import { Author } from "@/types";
import { capitalizeName } from "@/utils/string";
import pbClient from "@/client/pbClient";
import PreviewBase from "@/common/components/PreviewBase";

type Props = {
  author: Author;
};
const AuthorPreview = ({ author }: Props) => {
  return (
    <PreviewBase
      title={
        capitalizeName(author.name) +
        (author.nick_name ? ` (${author.nick_name})` : "")
      }
      imageUrl={
        author.author_img
          ? pbClient.files.getUrl(author, author.author_img)
          : ""
      }
      url={`/author/${author.id}`}
    />
  );
};

AuthorPreview.Compact = function Compact({ author }: Props) {
  return (
    <PreviewBase.Compact
      title={
        capitalizeName(author.name) +
        (author.nick_name ? ` (${author.nick_name})` : "")
      }
      imageUrl={
        author.author_img
          ? pbClient.files.getUrl(author, author.author_img)
          : ""
      }
      url={`/author/${author.id}`}
    />
  );
};

AuthorPreview.Loading = PreviewBase.Loading;

export default AuthorPreview;
