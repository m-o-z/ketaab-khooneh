"use client";
import type { Author } from "@/types";
import { Grid, Stack } from "@mantine/core";
import { useAuthorsGetAllApi } from "@/hooks/authors";
import AuthorPreview from "@/components/author/AuthorPreview";
import Breadcrumb from "@/common/components/Breadcrumb";
import React from "react";

export default function Home() {
  const { isLoading, data: isCategoryLoading } = useAuthorsGetAllApi();

  return (
    <Stack maw={768} mx="auto">
      <Breadcrumb
        items={[
          {
            title: "Authors",
            href: "/author",
          },
        ]}
      />
      {!isLoading ? (
        <Grid
          gutter={{
            base: 30,
            md: 50,
            xl: 60,
          }}
        >
          {isCategoryLoading?.map((author: Author) => (
            <Grid.Col
              span={{
                base: 12,
                md: 3,
                lg: 3,
                xl: 3,
                sm: 4,
                xs: 6,
              }}
              key={author.id}
            >
              <AuthorPreview author={author} />
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
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
          <Grid.Col>
            <AuthorPreview.Loading />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}
