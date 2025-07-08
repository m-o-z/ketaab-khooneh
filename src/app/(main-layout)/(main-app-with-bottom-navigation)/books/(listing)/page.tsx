"use client";
import { Stack } from "@mantine/core";
import { Divider, IconButton } from "@tapsioss/react-components";
import { Scan } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import ListToolbar from "@/common/components/ListToolbar";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import { PageLayout } from "@/providers/PageLayout";

export default function Books() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [debouncedSearch] = useDebounce(searchString, 1000, {
    leading: false,
    trailing: true,
  });

  const payload = useMemo(
    () => ({
      search: debouncedSearch,
      page,
      perPage: 10,
    }),
    [page, debouncedSearch],
  );

  const {
    isLoading,
    data: books,
    isError,
    isSuccess,
    refetch,
  } = useBooksGetAllApi(payload);

  const { isLoading: isCategoryLoading, data: categories } =
    useCategoriesQuery();

  const handleClick = (bookId: string) => {
    router.push(`books/${bookId}`);
  };
  const renderBooksSection = () => {
    return (
      <Stack>
        {books?.map((book, index) => (
          <Fragment key={book.id}>
            {index !== 0 && <Divider />}
            <div onClick={() => handleClick(book.id)}>
              <BookPreview.List book={book} />
            </div>
          </Fragment>
        ))}
      </Stack>
    );
  };

  const renderToolbar = () => {
    return (
      <ListToolbar
        filters={categories?.map((cat) => cat.label)}
        searchString={searchString}
        selectedFilters={filters}
        setSearchString={setSearchString}
        setSelectedFilters={setFilters}
      />
    );
  };

  return (
    <PageLayout
      goToTopEnabled
      initialActions={
        <IconButton variant="naked">
          <Scan />
        </IconButton>
      }
      initialTitle="کتاب‌ها"
      isError={isError}
      isLoading={isLoading || isCategoryLoading}
      noContent={isSuccess && books.length === 0}
      retry={() => {
        void refetch();
      }}
    >
      <div className="space-y-8">
        {renderToolbar()}
        {renderBooksSection()}
      </div>
    </PageLayout>
  );
}
