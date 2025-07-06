"use client";
import { Stack } from "@mantine/core";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import ListToolbar from "@/common/components/ListToolbar";
import AuthorPreview from "@/components/author/AuthorPreview";
import { useAuthorsGetAllApi } from "@/hooks/authors";
import { PageLayout } from "@/providers/PageLayout";
import type { Author } from "@/types";

export default function Home() {
  // TODO: refactor
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchString, 300);
  const {
    isLoading,
    isError,
    isSuccess,
    refetch,
    data: authors,
  } = useAuthorsGetAllApi({
    search: debouncedSearch,
  });

  const renderAuthorsListSection = () => {
    return (
      <Stack>
        {authors?.map((author: Author) => (
          <AuthorPreview.List key={author.id} author={author} />
        ))}
      </Stack>
    );
  };

  const renderToolbar = () => {
    return (
      <ListToolbar
        searchString={searchString}
        setSearchString={setSearchString}
      />
    );
  };

  const hasNoContent = isSuccess && authors.length === 0;

  return (
    <PageLayout
      goToTopEnabled
      initialTitle="نویسندگان"
      isError={isError}
      isLoading={isLoading}
      noContent={hasNoContent}
      retry={() => {
        void refetch();
      }}
    >
      <div className="space-y-8">
        {renderToolbar()}
        {renderAuthorsListSection()}
      </div>
    </PageLayout>
  );
}
