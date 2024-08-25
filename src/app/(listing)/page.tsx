"use client";
import type { Book } from "@/types";
import { Container, Grid } from "@mantine/core";
import { books } from "@/mock";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";

export default function Home() {
  const router = useRouter();

  const { isLoading, data } = useBooksGetAllApi();
  console.log("🐕 sag data", data); // TODO: REMOVE ME ⚠️

  return (
    <Container>
      {!isLoading ? (
        <Grid
          gutter={{
            base: 30,
            md: 50,
            xl: 60,
          }}
        >
          {books.map((book: Book) => (
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
    </Container>
  );
}
