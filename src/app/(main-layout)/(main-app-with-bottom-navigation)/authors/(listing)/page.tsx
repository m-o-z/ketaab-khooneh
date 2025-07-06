"use client";
import ListToolbar from "@/common/components/ListToolbar";
import AuthorPreview from "@/components/author/AuthorPreview";
import ErrorSection from "@/components/ErrorSection";
import { useAuthorsGetAllApi } from "@/hooks/authors";
import { PageLayout } from "@/providers/PageLayout";
import type { Author } from "@/types";
import { Stack } from "@mantine/core";
import { useState } from "react";
import { useDebounce } from "use-debounce";

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
    if (authors?.length === 0 || isError) return <ErrorSection />;
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
    <PageLayout initialTitle="نویسندگان" goToTopEnabled>
      <div className="space-y-8">
        {renderToolbar()}
        {renderAuthorsListSection()}
      </div>
    </PageLayout>
  );
}
