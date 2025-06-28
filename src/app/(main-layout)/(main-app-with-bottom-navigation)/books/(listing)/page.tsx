"use client";
import ListToolbar from "@/common/components/ListToolbar";
import Spinner from "@/common/Spinner/Spinner";
import BookPreview from "@/components/book/BookPreview";
import ErrorSection from "@/components/ErrorSection";
import NotFound from "@/components/NotFound";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import type { Book } from "@/types";
import { Container, Stack } from "@mantine/core";
import { Divider } from "@tapsioss/react-components";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

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
    data: bookWorks,
    isError,
    isSuccess,
    refetch,
  } = useBooksGetAllApi(payload);

  const { isLoading: isCategoryLoading, data: categories } =
    useCategoriesQuery();

  if (isError) {
    return <ErrorSection refetch={refetch} />;
  }

  if (isLoading) {
    return <Spinner />;
  }
  const handleClick = (bookId: string) => {
    router.push(`books/${bookId}`);
  };
  const renderBooksSection = () => {
    if (bookWorks?.length === 0 && isSuccess) return <NotFound />;
    return (
      <Stack>
        {bookWorks?.map((book: Book, index) => (
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
    if (isCategoryLoading || isLoading) return <ListToolbar.Loading />;
    if (isError) return null;
    return (
      <ListToolbar
        searchString={searchString}
        setSearchString={setSearchString}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        filters={categories?.map((cat) => cat.label)}
      />
    );
  };

  return (
    <Stack>
      <h1>کتاب‌ها</h1>
      {renderToolbar()}
      {renderBooksSection()}
    </Stack>
  );
}
