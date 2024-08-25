"use client";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import type { Book } from "@/types";
import { Container, Grid, Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListToolbar from "@/common/components/ListToolbar";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Breadcrumb from "@/common/components/Breadcrumb";

export default function Home() {
  const router = useRouter();
  const [searchString, setSearchString] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [debouncedSearch] = useDebounce(searchString, 300);
  const { isLoading, data: { items: books } = {} } = useBooksGetAllApi({
    search: debouncedSearch,
    filters,
  });

  const { isLoading: isCategoryLoading, data: categories } =
    useCategoriesQuery();

  return (
    <Container>
      <Stack>
        <Breadcrumb
          items={[
            {
              title: "Books",
              href: "/book",
            },
          ]}
        />
        {isCategoryLoading ? (
          <ListToolbar.Loading />
        ) : (
          <ListToolbar
            searchString={searchString}
            setSearchString={setSearchString}
            selectedFilters={filters}
            setSelectedFilters={setFilters}
            filters={categories?.map((cat) => cat.label)}
          />
        )}

        {!isLoading ? (
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
        ) : (
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
        )}
      </Stack>
    </Container>
  );
}
