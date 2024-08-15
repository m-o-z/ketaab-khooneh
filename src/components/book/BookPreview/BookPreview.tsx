"use client";
import React from "react";
import { Box, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import type { Book } from "@/types";
import BookStatus from "../BookStatus";

type Props = {
  book: Book;
  hideBottomTexts?: boolean;
  onClick?: () => void;
};

const HEIGHT = 200;
const WIDTH = 150;

const BookPreview = ({ book, hideBottomTexts, onClick = () => {} }: Props) => {
  return (
    <Paper onClick={onClick} style={{ flex: 1, width: WIDTH }}>
      <Box pos="relative">
        <Box pos="absolute" top={0} left={0} style={{ zIndex: 1 }}>
          <BookStatus status={book.status} />
        </Box>
        <Image
          src={book.coverImage}
          alt={`${book.title} cover`}
          width={WIDTH}
          height={HEIGHT}
          fit={"cover"}
          style={{
            filter: `grayscale(${book.status === "AVAILABLE" ? 0 : 1})`,
          }}
        />
        {!hideBottomTexts && (
          <Text truncate="end" size="sm">
            {book.title}
          </Text>
        )}
        {!hideBottomTexts && (
          <Text truncate="end" size="xs">
            {book.authors.map((author) => author.name).join(", ")}
          </Text>
        )}
      </Box>
    </Paper>
  );
};

BookPreview.Loading = function Loading() {
  return (
    <Box style={{ width: WIDTH }}>
      <Stack gap="xs" flex={1}>
        <Skeleton width={WIDTH} height={HEIGHT} />
        <Skeleton height="14px" width={"100px"} />
        <Skeleton height="10px" width={"150px"} />
      </Stack>
    </Box>
  );
};
export default BookPreview;
