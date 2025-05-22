"use client";
import type { Author } from "@/types";
import { Container, Grid, Stack } from "@mantine/core";
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
  const {
    isLoading,
    isError,
    data: authors,
  } = useAuthorsGetAllApi({
    search: debouncedSearch,
  });

  if (!authors) {
    return null;
  }
  console.log({ authors });

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
    if (authors?.length === 0 || isError) return <NotFound />;
    return (
      <Stack>
        {authors?.map((author: Author) => (
          <AuthorPreview.List key={author.id} author={author} />
        ))}
      </Stack>
    );
  };

  const renderToolbar = () => {
    if (isLoading) return <ListToolbar.Loading />;
    if (isError) return null;
    return (
      <ListToolbar
        searchString={searchString}
        setSearchString={setSearchString}
      />
    );
  };

  return (
    <Container>
      <Stack maw={768} mx="auto">
        <h1>نویسندگان</h1>
        {renderToolbar()}
        {renderAuthorsListSection()}
      </Stack>
    </Container>
  );
}
