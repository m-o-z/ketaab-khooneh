"use client";
import React from "react";
import { useParams } from "next/navigation";
import { books } from "@/mock";
import BookPreview from "@/components/book/BookPreview";
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import AuthorPreview from "@/components/author/AuthorPreview/AuthorPreview";
import UserPreview from "@/components/user/UserPreview/UserPreview";
import {
  IconBooks,
  IconCalendarMonth,
  IconError404,
  IconFeather,
  IconMoodSad,
  IconShoppingBagPlus,
  IconShoppingCart,
  IconShoppingCartExclamation,
  IconShoppingCartPlus,
  IconX,
} from "@tabler/icons-react";
import BookSummary from "@/components/book/BookSummary/BookSummary";

// TODO: fix style
const Page = () => {
  const { bookId } = useParams();
  const book = books.find((book) => book.id === bookId);

  const renderActionArea = () => {
    if (book?.status === "BORROWED") {
      return (
        book.borrowedBy && (
          <Alert color="gray" icon={<IconShoppingCartExclamation />}>
            <Flex gap="sm">
              <Text>This book is currently borrowed by</Text>
              <UserPreview user={book.borrowedBy} />
            </Flex>
          </Alert>
        )
      );
    }
    if (book?.status === "RESERVED_BY_ME") {
      return (
        <Alert color="blue" icon={<IconShoppingCart />}>
          <Stack gap="sm">
            <Text>This book is currently reserved by you</Text>
            <div>
              <Button color="red" leftSection={<IconX />}>
                Cancel Reservation
              </Button>
            </div>
          </Stack>
        </Alert>
      );
    }
    if (book?.status === "RESERVED_BY_OTHERS") {
      return (
        book.reservedBy && (
          <Alert color="yellow">
            <Flex gap="sm">
              <Text>This book is currently reserved by</Text>
              <UserPreview user={book.reservedBy} />
            </Flex>
          </Alert>
        )
      );
    }
    if (book?.status === "AVAILABLE") {
      return (
        <Button color="green" fullWidth leftSection={<IconShoppingCartPlus />}>
          Borrow the Book!
        </Button>
      );
    }
    if (book?.status === "NOT_AVAILABLE") {
      return (
        <Alert icon={<IconMoodSad />} color="red">
          This book is not available right now
        </Alert>
      );
    }
  };
  return (
    <Box maw={768} mx="auto">
      {book && (
        <Stack gap="md" w="100%">
          <BookSummary book={book} />
          {renderActionArea()}
        </Stack>
      )}
    </Box>
  );
};

export default Page;
