import React from "react";
import BookPreview from "@/components/book/BookPreview";
import {
  Badge,
  Box,
  Container,
  Flex,
  rem,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBooks,
  IconCalendarMonth,
  IconFeather,
  IconTag,
} from "@tabler/icons-react";
import AuthorPreview from "@/components/author/AuthorPreview/AuthorPreview";
import { Book } from "@/types";

type Props = {
  book: Book;
};
const BookSummary = ({ book }: Props) => {
  return (
    <>
      <BookPreview book={book} hideBottomTexts width="14rem" height="auto" />
      <Flex direction="column" gap="md" align="flex-start" w="100%">
        <Flex gap="sm" align="end" my="lg">
          <Title order={2} m="0" lh={1}>
            {book.title}
          </Title>
          {book.edition && (
            <Badge
              variant="light"
              size="sm"
              color={"cyan"}
              style={{ transform: "translateY(-1px)" }}
            >
              Edition {book.edition}
            </Badge>
          )}
        </Flex>
        <Flex columnGap="sm" align="center">
          <Flex
            align={"center"}
            style={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            <IconBooks />
          </Flex>
          <Text flex={"0 0 auto"} lh={"24px"} c="gray.6">
            Count
          </Text>
          <Text flex={"1 0 auto"} fw={500} lh={"24px"}>
            {book.count}
          </Text>
        </Flex>
        <Flex columnGap="sm" align="center">
          <Flex
            align={"center"}
            style={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            <IconTag size={"24px"} />
          </Flex>
          <Text flex={"0 0 auto"} lh={"24px"} c="gray.6">
            Category
          </Text>
          <Text flex={"1 0 auto"} fw={500} lh={"24px"}>
            {book.category}
          </Text>
        </Flex>
        <Flex columnGap="sm" align="center">
          <Flex
            align={"center"}
            style={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            <IconCalendarMonth
              style={{
                lineHeight: "24px",
              }}
            />
          </Flex>
          <Text flex={"0 0 auto"} lh={"24px"} c="gray.6">
            Release Year
          </Text>
          <Text flex={"1 0 auto"} fw={500} lh={"24px"}>
            {book.releaseYear}
          </Text>
        </Flex>
        <Flex wrap="wrap" columnGap="sm">
          <Flex
            align={"center"}
            style={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            <IconFeather />
          </Flex>

          {book.authors.map((author) => (
            <AuthorPreview key={author.id} author={author} />
          ))}
        </Flex>
      </Flex>
      <Box my="lg">
        <Text>{book.description}</Text>
      </Box>
    </>
  );
};

export default BookSummary;
