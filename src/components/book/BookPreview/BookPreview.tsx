"use client";
import AuthorPreview from "@/components/author/AuthorPreview";
import { BookDTO } from "@/schema/books";
import { capitalizeName } from "@/utils/string";
import { Box, Flex, Image, Paper, Stack, Text, Title } from "@mantine/core";
import {
  BadgeWrapper,
  BadgeWrapperSlots,
  Skeleton,
} from "@tapsioss/react-components";
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
    <Flex onClick={onClick} justify={"center"}>
      <div style={{ width: width }}>
        <BadgeWrapper anchorShape="rectangle">
          <Box slot={BadgeWrapperSlots.BADGE}>
            <BookStatus status={book.status} />
          </Box>
          <Flex pos="relative" justify={"center"}>
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              width={width}
              height={height}
              fit={"cover"}
              style={{
                // filter: `grayscale(${book.status === "AVAILABLE" ? 0 : 1})`,
                aspectRatio: 1 / 1.3636,
              }}
            />
          </Flex>
        </BadgeWrapper>
      </div>

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
          <Skeleton variant={"rectangular"} width="200px" height="24px" />
          <Skeleton variant={"rectangular"} width="100px" height="24px" />
        </Stack>
        <Flex gap={8} align="center">
          <Skeleton variant={"circular"} width="24px" height="24px" />
          <Skeleton variant={"rectangular"} width="100px" height="20px" />
        </Flex>
      </Stack>
    </Flex>
  );
};

BookPreview.List = function List({ book }: Partial<Props>) {
  if (!book) return null;
  return (
    <Flex gap={30}>
      <Box miw={listWidth} w={listWidth}>
        <BadgeWrapper anchorShape="rectangle" badgeSide="left">
          <Box slot={BadgeWrapperSlots.BADGE}>
            <BookStatus status={book.status} />
          </Box>
          <Box pos="relative">
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              fit="cover"
              style={{ borderRadius: "0.5rem" }}
              width="100%"
              height={listHeight}
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
        <Flex wrap="wrap" gap="xs">
          {book.authors.map((author) => (
            <AuthorPreview.Compact key={author.id} author={author} />
          ))}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default BookPreview;
