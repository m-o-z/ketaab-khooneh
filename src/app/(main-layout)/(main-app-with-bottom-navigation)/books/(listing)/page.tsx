"use client";
import ListToolbar from "@/common/components/ListToolbar";
import BookPreview from "@/components/book/BookPreview";
import ErrorSection from "@/components/ErrorSection";
import NotFound from "@/components/NotFound";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import type { Book } from "@/types";
import { Container, Grid, Stack } from "@mantine/core";
import { Divider } from "@tapsioss/react-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
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
    data: books,
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
    return (
      <Grid
        gutter={{
          base: 30,
          md: 50,
          xl: 60,
        }}
      >
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
        <Grid.Col>
          <BookPreview.Loading />
        </Grid.Col>
      </Grid>
    );
  }
  const renderBooksSection = () => {
    if (books?.length === 0 && isSuccess) return <NotFound />;
    return (
      <Stack>
        {books?.map((book: Book, index) => (
          <Fragment key={book.id}>
            {index !== 0 && <Divider />}
            <Link href={`books/${book.id}`}>
              <BookPreview.List book={book} />
            </Link>
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
    <Container>
      <Stack>
        <h1>کتاب‌ها</h1>
        {renderToolbar()}
        {renderBooksSection()}
      </Stack>
    </Container>
  );
}
