"use client";
import { Box, Flex, Image, Paper, Stack, Text, Title } from "@mantine/core";
import {
  BadgeWrapper,
  BadgeWrapperSlots,
  Skeleton,
} from "@tapsioss/react-components";

import AuthorPreview from "@/components/author/AuthorPreview";
import { BookDTO } from "@/schema/books";
import { capitalizeName } from "@/utils/string";

import BookStatus from "../BookStatus";

type Props = {
  book: BookDTO;
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
    <Flex justify={"center"} onClick={onClick}>
      <div style={{ width: width }}>
        <BadgeWrapper anchorShape="rectangle">
          <Box slot={BadgeWrapperSlots.BADGE}>
            <BookStatus status={book.status} />
          </Box>
          <Flex justify={"center"} pos="relative">
            <Image
              alt={`${book.title} cover`}
              fit={"cover"}
              height={height}
              src={book.coverImage}
              style={{
                // filter: `grayscale(${book.status === "AVAILABLE" ? 0 : 1})`,
                aspectRatio: 1 / 1.3636,
              }}
              width={width}
            />
          </Flex>
        </BadgeWrapper>
      </div>

      {!hideBottomTexts && (
        <Title
          c="gray.4"
          fw={"500"}
          fz={"h4"}
          lh={1.4}
          lineClamp={2}
          my={".5rem"}
          order={1}
        >
          {book.title}
        </Title>
      )}
      {!hideBottomTexts && (
        <Text c="dimmed" size="xs" truncate="end">
          {book.authors.map((author) => capitalizeName(author.name)).join(", ")}
        </Text>
      )}
    </Flex>
  );
};

const listWidth = 100;
const listHeight = 150;

BookPreview.Loading = function Loading() {
  return (
    <Flex gap={30}>
      <Box miw={listWidth} w={listWidth}>
        <Skeleton height={`${listHeight}px`} width={`${listWidth}px`} />
      </Box>
      <Stack style={{ width: `calc(100%-${listWidth}px)`, overflow: "hidden" }}>
        <Stack gap={3}>
          <Skeleton height="24px" variant={"rectangular"} width="200px" />
          <Skeleton height="24px" variant={"rectangular"} width="100px" />
        </Stack>
        <Flex align="center" gap={8}>
          <Skeleton height="24px" variant={"circular"} width="24px" />
          <Skeleton height="20px" variant={"rectangular"} width="100px" />
        </Flex>
      </Stack>
    </Flex>
  );
};

BookPreview.List = function List({ book }: Partial<Props>) {
  if (!book) return null;
  return (
    <Flex className="cursor-pointer" gap={30}>
      <Box miw={listWidth} w={listWidth}>
        <BadgeWrapper anchorShape="rectangle" badgeSide="left">
          <Box slot={BadgeWrapperSlots.BADGE}>
            <BookStatus status={book.status} />
          </Box>
          <Box pos="relative">
            <Image
              alt={`${book.title} cover`}
              fit="cover"
              height={listHeight}
              src={book.coverImage}
              style={{ borderRadius: "0.5rem" }}
              width="100%"
            />
          </Box>
        </BadgeWrapper>
      </Box>
      <Stack style={{ width: `calc(100%-${listWidth}px)`, overflow: "hidden" }}>
        <b
          style={{
            lineClamp: 2,
            textOverflow: "ellipsis",
            width: `calc(100%-${listWidth}px)`,
          }}
        >
          کتاب {book.title}
        </b>
        <Flex gap="xs" wrap="wrap">
          {book.authors.map((author) => (
            <AuthorPreview.Compact key={author.id} author={author} noLink />
          ))}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default BookPreview;
