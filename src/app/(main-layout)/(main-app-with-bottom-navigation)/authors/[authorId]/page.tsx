"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useAuthorGetApi } from "@/hooks/authors";
import AuthorPreview from "@/components/author/AuthorPreview";
import { Container, Stack } from "@mantine/core";
import ErrorSection from "@/components/ErrorSection";
import { Avatar } from "@tapsioss/react-components";
import { capitalizeName } from "@/utils/string";

const Page = () => {
  const { authorId } = useParams();
  const {
    data: author,
    isLoading,
    isError,
  } = useAuthorGetApi(authorId as string);

  const renderAuthorPreview = () => {
    if (isLoading) {
      return <AuthorPreview.Loading />;
    }
    if (isError) {
      return (
        <ErrorSection description="خطایی در نمایش اطلاعات نویسنده رخ داد!" />
      );
    }
    if (author) {
      return (
        <>
          {author.authorImg && (
            <Avatar image={author.authorImg} size="xxlg" alt={author.name} />
          )}
          {capitalizeName(author.name) + author.name}
          {author.bio && <p>{author.bio}</p>}
        </>
      );
    }
  };

  return (
    <Stack>
      <h1>اطلاعات {author?.name}</h1>
      {renderAuthorPreview()}
    </Stack>
  );
};

export default Page;
