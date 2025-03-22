"use client";
import ListToolbar from "@/common/components/ListToolbar";
import BookPreview from "@/components/book/BookPreview";
import NotFound from "@/components/NotFound";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import type { Book } from "@/types";
import { Divider } from "@tapsioss/react-components";
import { Container, Grid, Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Books() {
  const router = useRouter();
  // TODO: refactor
  const [searchString, setSearchString] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [debouncedSearch] = useDebounce(searchString, 300);
  const {
    isLoading,
    data: { items: books } = {},
    isError,
    refetch,
  } = useBooksGetAllApi({
    search: debouncedSearch,
    filters,
  });

  const { isLoading: isCategoryLoading, data: categories } =
    useCategoriesQuery();

  const renderBooksSection = () => {
    if (isError) {
      return <NotFound />;
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
    if (books?.length === 0) return <NotFound />;
    return (
      <Stack>
        {books?.map((book: Book, index) => (
          <Fragment key={book.id}>
            {index !== 0 && <Divider />}
            <Link href={`book/${book.id}`}>
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
