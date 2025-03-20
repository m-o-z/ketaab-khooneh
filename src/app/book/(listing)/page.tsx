"use client";
import ListToolbar from "@/common/components/ListToolbar";
import BookPreview from "@/components/book/BookPreview";
import NotFound from "@/components/NotFound";
import {
  EmptyState,
  EmptyStateSlots,
  Button,
  ButtonSlots,
} from "@tapsioss/react-components";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import useAuthenticated from "@/hooks/useAuthenticated";
import type { Book } from "@/types";
import { Container, Grid, Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  ArrowTwoCirclepathVertical,
  HeartBrokenFill,
} from "@tapsioss/react-icons";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export default function Home() {
  const navigate = useRouter();
  const isAuthenticated = useAuthenticated();

  useLayoutEffect(() => {
    if (isAuthenticated === false) {
      navigate.replace("/login");
    }
  }, []);

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
      <Grid
        gutter={{
          base: 30,
          md: 50,
          xl: 60,
        }}
      >
        {books?.map((book: Book) => (
          <Grid.Col
            span={{
              base: 12,
              md: 3,
              lg: 3,
              xl: 3,
              sm: 4,
              xs: 6,
            }}
            key={book.id}
          >
            <Link href={`book/${book.id}`}>
              <BookPreview
                onClick={() => router.push(`book/${book.id}`)}
                book={book}
              />
            </Link>
          </Grid.Col>
        ))}
      </Grid>
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
