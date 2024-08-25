"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useAuthorGetApi } from "@/hooks/authors";
import AuthorPreview from "@/components/author/AuthorPreview";
import { Stack } from "@mantine/core";
import Breadcrumb from "@/common/components/Breadcrumb";

const Page = () => {
  const { authorId } = useParams();
  const { data: author, isLoading } = useAuthorGetApi(authorId as string);

  return (
    <Stack maw={768} mx="auto">
      <Breadcrumb
        items={[
          {
            title: "Authors",
            href: "/author",
          },
          {
            title: author?.name || "...",
            href: `/author/${authorId}`,
          },
        ]}
      />
      {isLoading ? (
        <AuthorPreview.Loading />
      ) : (
        <>{author && <AuthorPreview author={author} />}</>
      )}
    </Stack>
  );
};

export default Page;
