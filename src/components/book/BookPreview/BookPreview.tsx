"use client";
import React from "react";
import {Box, Container, Image, Paper, Skeleton, Stack, Text, Title} from "@mantine/core";
import type { Book } from "@/types";
import BookStatus from "../BookStatus";
import { capitalizeName } from "@/utils/string";
import { BadgeWrapper, BadgeWrapperSlots } from "@tapsioss/react-components";
import pbClient from "@/client/pbClient";

type Props = {
  book: Book;
  hideBottomTexts?: boolean;
  onClick?: () => void;
  height?: string;
  width?: string;
};

const HEIGHT = "auto";
const WIDTH = "100%";

const BookPreview = ({
  book,
  hideBottomTexts,
  onClick = () => {},
  width = WIDTH,
  height = HEIGHT,
}: Props) => {
  return (
    <Paper onClick={onClick} style={{ flex: 1, width: width }}>
      <Container>
        <BadgeWrapper anchorShape="rectangle">
          <Box slot={BadgeWrapperSlots.BADGE}>
            <BookStatus status={book.status} />
          </Box>
          <Box pos="relative">
            <Image
                src={
                  pbClient.files.getUrl(
                      book,
                      book.cover_image,
                  )
                }
                alt={`${book.title} cover`}
                width={width}
                height={height}
                fit={"cover"}
                style={{
                  // filter: `grayscale(${book.status === "AVAILABLE" ? 0 : 1})`,
                  aspectRatio: 1 / 1.3636,
                }}
            />

          </Box>
        </BadgeWrapper>
      </Container>
      {!hideBottomTexts && (
          <Title
              order={1}
              fz={"h4"}
              lh={1.4}
              my={".5rem"}
              fw={"500"}
              c="gray.4"
              lineClamp={2}
          >
            {book.title}
          </Title>
      )}
      {!hideBottomTexts && (
          <Text truncate="end" size="xs" c="dimmed">
            {book.expand.authors
                .map((author) => capitalizeName(author.name))
                .join(", ")}
          </Text>
      )}
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
