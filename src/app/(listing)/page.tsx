"use client";
import type { Book } from "@/types";
import { Box, Container, Flex, Grid } from "@mantine/core";
import { books } from "@/mock";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookPreview from "@/components/book/BookPreview";

export default function Home() {
  const router = useRouter();
  return (
    <Container>
      {true ? (
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
                lg: 2,
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
        <>
          <BookPreview.Loading />
          <BookPreview.Loading />
          <BookPreview.Loading />
          <BookPreview.Loading />
          <BookPreview.Loading />
          <BookPreview.Loading />
          <BookPreview.Loading />
        </>
      )}
    </Container>
  );
}
