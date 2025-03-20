"use client";
import type { Author } from "@/types";
import { Grid, Stack } from "@mantine/core";
import { useAuthorsGetAllApi } from "@/hooks/authors";
import AuthorPreview from "@/components/author/AuthorPreview";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import ListToolbar from "@/common/components/ListToolbar";
import NotFound from "@/components/NotFound";

export default function Home() {
  // TODO: refactor
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchString, 300);
  const { isLoading, data: { items: authors } = {} } = useAuthorsGetAllApi({
    search: debouncedSearch,
  });

  const renderAuthorsListSection = () => {
    if (isLoading) {
      return (
        <Stack>
          <AuthorPreview.Loading />
          <AuthorPreview.Loading />
          <AuthorPreview.Loading />
          <AuthorPreview.Loading />
          <AuthorPreview.Loading />
        </Stack>
      );
    }
    if (authors?.length === 0) return <NotFound />;
    return (
      <Stack>
        {authors?.map((author: Author) => (
          <AuthorPreview.List key={author.id} author={author} />
        ))}
      </Stack>
    );
  };

  return (
    <Stack maw={768} mx="auto">
      <h1>نویسندگان</h1>
      <ListToolbar
        searchString={searchString}
        setSearchString={setSearchString}
      />
      {renderAuthorsListSection()}
    </Stack>
  );
}
